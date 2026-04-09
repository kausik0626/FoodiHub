import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";

const DELIVERY_CHARGE = 50;

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured on the server.");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay is not configured on the server.");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const buildNormalizedOrder = async (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "Your cart is empty." };
  }

  const itemIds = items.map((item) => item._id);
  const foods = await foodModel.find({ _id: { $in: itemIds } });

  if (foods.length !== items.length) {
    return { error: "One or more food items are unavailable." };
  }

  const ownerIds = [...new Set(foods.map((food) => String(food.ownerId)))];
  if (ownerIds.length !== 1) {
    return { error: "Please order from one restaurant at a time." };
  }

  const foodMap = new Map(foods.map((food) => [String(food._id), food]));
  let subtotal = 0;

  const normalizedItems = items.map((item) => {
    const food = foodMap.get(String(item._id));
    const quantity = Number(item.quantity) || 0;
    subtotal += food.price * quantity;

    return {
      _id: food._id,
      name: food.name,
      description: food.description,
      price: food.price,
      image: food.image,
      category: food.category,
      quantity,
      ownerId: food.ownerId,
      restaurantName: food.restaurantName,
    };
  });

  return {
    ownerId: String(foods[0].ownerId),
    restaurantName: foods[0].restaurantName,
    normalizedItems,
    totalAmount: subtotal + DELIVERY_CHARGE,
  };
};

const placeOrder = async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL;

  try {
    const { userId, items, address, paymentMethod } = req.body;
    const selectedPaymentMethod = paymentMethod || "COD";

    const normalizedOrder = await buildNormalizedOrder(items);
    if (normalizedOrder.error) {
      return res.json({ success: false, message: normalizedOrder.error });
    }

    const { ownerId, restaurantName, normalizedItems, totalAmount } = normalizedOrder;

    const newOrder = new orderModel({
      userId,
      ownerId,
      restaurantName,
      items: normalizedItems,
      amount: totalAmount,
      address,
      paymentMethod: selectedPaymentMethod,
      payment: selectedPaymentMethod === "COD",
    });

    await newOrder.save();

    if (selectedPaymentMethod === "COD") {
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      return res.json({
        success: true,
        message: "Order placed successfully! Pay on delivery.",
        orderId: newOrder._id,
      });
    }

    if (selectedPaymentMethod === "Razorpay") {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        await orderModel.findByIdAndDelete(newOrder._id);
        return res.json({
          success: false,
          message: "Razorpay is not configured on the server.",
        });
      }

      const razorpay = getRazorpayClient();
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `foodiehub_${newOrder._id}`,
        notes: {
          orderId: String(newOrder._id),
          userId: String(userId),
        },
      });

      return res.json({
        success: true,
        paymentProvider: "Razorpay",
        orderId: newOrder._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        razorpayKey: process.env.RAZORPAY_KEY_ID,
      });
    }

    const lineItems = normalizedItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charge" },
        unit_amount: DELIVERY_CHARGE * 100,
      },
      quantity: 1,
    });

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, paymentProvider: "Stripe", session_url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Order placement failed." });
  }
};

const verifyOrder = async (req, res) => {
  const {
    orderId,
    success,
    paymentProvider,
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  } = req.body;

  try {
    if (paymentProvider === "Razorpay") {
      if (success === false || success === "false") {
        await orderModel.findByIdAndDelete(orderId);
        return res.json({ success: false, message: "Payment cancelled." });
      }

      const order = await orderModel.findById(orderId);
      if (!order) {
        return res.json({ success: false, message: "Order not found." });
      }

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (expectedSignature !== razorpaySignature) {
        await orderModel.findByIdAndDelete(orderId);
        return res.json({ success: false, message: "Payment verification failed." });
      }

      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        paymentMethod: "Razorpay",
      });
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

      return res.json({ success: true, message: "Payment verified successfully!" });
    }

    if (success === "true") {
      const order = await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true }
      );

      if (order) {
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      }

      return res.json({ success: true, message: "Payment verified successfully!" });
    }

    await orderModel.findByIdAndDelete(orderId);
    return res.json({ success: false, message: "Payment failed. Order cancelled." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Payment verification failed." });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId }).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to fetch orders." });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ ownerId: req.owner.id }).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to fetch orders." });
  }
};

const updateStatus = async (req, res) => {
  try {
    const updated = await orderModel.findOneAndUpdate(
      { _id: req.body.orderId, ownerId: req.owner.id },
      { status: req.body.status },
      { new: true }
    );

    if (!updated) {
      return res.json({ success: false, message: "Order not found." });
    }

    res.json({ success: true, message: "Order status updated." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to update status." });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
