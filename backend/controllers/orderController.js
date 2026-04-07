import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const DELIVERY_CHARGE = 50; // ₹50 delivery charge

// Place Order (COD or Stripe)
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL;
  try {
    const { userId, items, amount, address, paymentMethod } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "Your cart is empty." });
    }

    const itemIds = items.map((item) => item._id);
    const foods = await foodModel.find({ _id: { $in: itemIds } });

    if (foods.length !== items.length) {
      return res.json({ success: false, message: "One or more food items are unavailable." });
    }

    const ownerIds = [...new Set(foods.map((food) => food.ownerId))];
    if (ownerIds.length !== 1) {
      return res.json({
        success: false,
        message: "Please order from one restaurant at a time.",
      });
    }

    const ownerFoodMap = new Map(foods.map((food) => [String(food._id), food]));
    const normalizedItems = items.map((item) => {
      const food = ownerFoodMap.get(String(item._id));
      return {
        ...item,
        ownerId: food.ownerId,
        restaurantName: food.restaurantName,
      };
    });

    const restaurantName = foods[0].restaurantName;
    const ownerId = foods[0].ownerId;

    const newOrder = new orderModel({
      userId,
      ownerId,
      restaurantName,
      items: normalizedItems,
      amount,
      address,
      paymentMethod: paymentMethod || "COD",
      payment: paymentMethod === "COD" ? true : false, // COD is auto-paid
    });
    await newOrder.save();

    // Clear cart after order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    if (paymentMethod === "COD") {
      return res.json({
        success: true,
        message: "Order placed successfully! Pay on delivery.",
        orderId: newOrder._id,
      });
    }

    // Stripe Payment
    const line_items = normalizedItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charge" },
        unit_amount: DELIVERY_CHARGE * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Order placement failed." });
  }
};

// Verify Stripe Payment
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment verified successfully!" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed. Order cancelled." });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Payment verification failed." });
  }
};

// Get user's orders
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.body.userId })
      .sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to fetch orders." });
  }
};

// List all orders (Admin)
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ ownerId: req.owner.id }).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to fetch orders." });
  }
};

// Update order status (Admin)
const updateStatus = async (req, res) => {
  try {
    const updated = await orderModel.findOneAndUpdate(
      { _id: req.body.orderId, ownerId: req.owner.id },
      {
      status: req.body.status,
      },
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
