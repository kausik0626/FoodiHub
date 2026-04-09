import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useStore } from "../../context/store-context";
import { toast } from "react-toastify";
import "./PlaceOrder.css";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    setCartItems,
  } = useStore();
  const navigate = useNavigate();
  const DELIVERY_CHARGE = 50;

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
    phone: "",
  });

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const verifyRazorpayPayment = async (orderId, paymentResponse) => {
    const res = await axios.post(`${url}/api/order/verify`, {
      orderId,
      paymentProvider: "Razorpay",
      ...paymentResponse,
    });

    if (!res.data.success) {
      throw new Error(res.data.message || "Payment verification failed.");
    }

    setCartItems({});
    toast.success("Payment successful! Your order is confirmed.");
    navigate("/myorders");
  };

  const cancelRazorpayOrder = async (orderId) => {
    try {
      await axios.post(`${url}/api/order/verify`, {
        orderId,
        paymentProvider: "Razorpay",
        success: false,
      });
    } catch (error) {
      console.error("Failed to cancel Razorpay order:", error);
    }
  };

  const openRazorpayCheckout = async (paymentData) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      await cancelRazorpayOrder(paymentData.orderId);
      toast.error("Unable to load Razorpay checkout. Please try again.");
      return;
    }

    const options = {
      key: paymentData.razorpayKey,
      amount: paymentData.amount,
      currency: paymentData.currency,
      name: "FoodieHUB",
      description: "Order payment",
      order_id: paymentData.razorpayOrderId,
      prefill: {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        contact: data.phone,
      },
      theme: {
        color: "#ff6b35",
      },
      handler: async (response) => {
        try {
          await verifyRazorpayPayment(paymentData.orderId, response);
        } catch (error) {
          toast.error(error.message || "Payment verification failed.");
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: async () => {
          await cancelRazorpayOrder(paymentData.orderId);
          setLoading(false);
          toast.info("Razorpay checkout was closed.");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", async () => {
      await cancelRazorpayOrder(paymentData.orderId);
      setLoading(false);
      toast.error("Payment failed. Please try again.");
    });
    razorpay.open();
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({ _id: item._id, quantity: cartItems[item._id] }));

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + DELIVERY_CHARGE,
      paymentMethod,
    };

    try {
      const res = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        setLoading(false);
        return;
      }

      if (paymentMethod === "COD") {
        toast.success("Order placed! Pay on delivery.");
        setCartItems({});
        navigate("/myorders");
        return;
      }

      if (paymentMethod === "Razorpay") {
        await openRazorpayCheckout(res.data);
        return;
      }

      window.location.replace(res.data.session_url);
    } catch {
      toast.error("Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  const subtotal = getTotalCartAmount();
  const total = subtotal + DELIVERY_CHARGE;

  return (
    <div className="place-order">
      <div className="container">
        <div className="place-order__header animate-fadeUp">
          <h1 className="section-title">
            Checkout <span>Cart</span>
          </h1>
          <p className="section-subtitle">Complete your order details below</p>
        </div>

        <form onSubmit={placeOrder} className="place-order__content">
          <div className="place-order__form animate-fadeUp">
            <h3>Delivery Information</h3>

            <div className="place-order__row">
              <div className="place-order__field">
                <label>First Name</label>
                <input
                  name="firstName"
                  type="text"
                  placeholder="John"
                  required
                  className="input-field"
                  value={data.firstName}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="place-order__field">
                <label>Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  required
                  className="input-field"
                  value={data.lastName}
                  onChange={onChangeHandler}
                />
              </div>
            </div>

            <div className="place-order__field">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                className="input-field"
                value={data.email}
                onChange={onChangeHandler}
              />
            </div>

            <div className="place-order__field">
              <label>Street Address</label>
              <input
                name="street"
                type="text"
                placeholder="123 Main Street, Area"
                required
                className="input-field"
                value={data.street}
                onChange={onChangeHandler}
              />
            </div>

            <div className="place-order__row">
              <div className="place-order__field">
                <label>City</label>
                <input
                  name="city"
                  type="text"
                  placeholder="Mumbai"
                  required
                  className="input-field"
                  value={data.city}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="place-order__field">
                <label>State</label>
                <input
                  name="state"
                  type="text"
                  placeholder="Maharashtra"
                  required
                  className="input-field"
                  value={data.state}
                  onChange={onChangeHandler}
                />
              </div>
            </div>

            <div className="place-order__row">
              <div className="place-order__field">
                <label>ZIP Code</label>
                <input
                  name="zipcode"
                  type="text"
                  placeholder="400001"
                  required
                  className="input-field"
                  value={data.zipcode}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="place-order__field">
                <label>Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  className="input-field"
                  value={data.phone}
                  onChange={onChangeHandler}
                />
              </div>
            </div>

            <div className="place-order__payment">
              <h3>Payment Method</h3>
              <div className="place-order__payment-options">
                <label
                  className={`place-order__payment-opt ${paymentMethod === "COD" ? "active" : ""}`}
                  htmlFor="pay-cod"
                >
                  <input
                    type="radio"
                    id="pay-cod"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                  />
                  <span className="place-order__payment-icon">Cash</span>
                  <div>
                    <strong>Cash on Delivery</strong>
                    <p>Pay when your food arrives</p>
                  </div>
                </label>

                <label
                  className={`place-order__payment-opt ${paymentMethod === "Razorpay" ? "active" : ""}`}
                  htmlFor="pay-razorpay"
                >
                  <input
                    type="radio"
                    id="pay-razorpay"
                    name="payment"
                    value="Razorpay"
                    checked={paymentMethod === "Razorpay"}
                    onChange={() => setPaymentMethod("Razorpay")}
                  />
                  <span className="place-order__payment-icon">RZP</span>
                  <div>
                    <strong>Pay with Razorpay</strong>
                    <p>Secure checkout with the final order total auto-filled</p>
                  </div>
                </label>

                <label
                  className={`place-order__payment-opt ${paymentMethod === "Stripe" ? "active" : ""}`}
                  htmlFor="pay-stripe"
                >
                  <input
                    type="radio"
                    id="pay-stripe"
                    name="payment"
                    value="Stripe"
                    checked={paymentMethod === "Stripe"}
                    onChange={() => setPaymentMethod("Stripe")}
                  />
                  <span className="place-order__payment-icon">Card</span>
                  <div>
                    <strong>Pay with Stripe</strong>
                    <p>Credit or debit card via Stripe checkout</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="place-order__summary animate-fadeUp">
            <h3>Order Summary</h3>
            <div className="place-order__order-items">
              {food_list
                .filter((item) => cartItems[item._id] > 0)
                .map((item) => (
                  <div key={item._id} className="place-order__order-item">
                    <span>
                      {item.name} x {cartItems[item._id]}
                    </span>
                    <span>Rs {item.price * cartItems[item._id]}</span>
                  </div>
                ))}
            </div>

            <div className="place-order__summary-rows">
              <div className="place-order__summary-row">
                <span>Subtotal</span>
                <span>Rs {subtotal}</span>
              </div>
              <div className="place-order__summary-row">
                <span>Delivery Charge</span>
                <span>Rs {DELIVERY_CHARGE}</span>
              </div>
              <div className="place-order__summary-row place-order__summary-total">
                <span>Total</span>
                <span>Rs {total}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary place-order__submit"
              disabled={loading}
            >
              {loading ? (
                <span className="login-popup__loader" />
              ) : paymentMethod === "COD" ? (
                "Place Order"
              ) : paymentMethod === "Razorpay" ? (
                `Pay Rs ${total} with Razorpay`
              ) : (
                "Pay with Stripe"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
