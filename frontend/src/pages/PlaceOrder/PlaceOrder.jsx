import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useStore } from "../../context/store-context";
import { toast } from "react-toastify";
import "./PlaceOrder.css";

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

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({ ...item, quantity: cartItems[item._id] }));

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

      if (res.data.success) {
        if (paymentMethod === "COD") {
          toast.success("🎉 Order placed! Pay on delivery.");
          setCartItems({});
          navigate("/myorders");
        } else {
          // Stripe redirect
          window.location.replace(res.data.session_url);
        }
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
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
            Checkout <span>🛍️</span>
          </h1>
          <p className="section-subtitle">Complete your order details below</p>
        </div>

        <form onSubmit={placeOrder} className="place-order__content">
          {/* Delivery Details */}
          <div className="place-order__form animate-fadeUp">
            <h3>📍 Delivery Information</h3>

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

            {/* Payment Method */}
            <div className="place-order__payment">
              <h3>💳 Payment Method</h3>
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
                  <span className="place-order__payment-icon">💵</span>
                  <div>
                    <strong>Cash on Delivery</strong>
                    <p>Pay when food arrives</p>
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
                  <span className="place-order__payment-icon">💳</span>
                  <div>
                    <strong>Pay Online</strong>
                    <p>Credit / Debit card via Stripe</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="place-order__summary animate-fadeUp">
            <h3>📋 Order Summary</h3>
            <div className="place-order__order-items">
              {food_list
                .filter((item) => cartItems[item._id] > 0)
                .map((item) => (
                  <div key={item._id} className="place-order__order-item">
                    <span>
                      {item.name} × {cartItems[item._id]}
                    </span>
                    <span>₹{item.price * cartItems[item._id]}</span>
                  </div>
                ))}
            </div>

            <div className="place-order__summary-rows">
              <div className="place-order__summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="place-order__summary-row">
                <span>Delivery Charge</span>
                <span>₹{DELIVERY_CHARGE}</span>
              </div>
              <div className="place-order__summary-row place-order__summary-total">
                <span>Total</span>
                <span>₹{total}</span>
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
                "🚀 Place Order"
              ) : (
                "💳 Pay with Stripe"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
