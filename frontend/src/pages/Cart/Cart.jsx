import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../context/store-context";
import "./Cart.css";

const Cart = () => {
  const {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
  } = useStore();
  const navigate = useNavigate();
  const DELIVERY_CHARGE = 50;

  const cartList = food_list.filter(
    (item) => cartItems[item._id] > 0
  );
  const subtotal = getTotalCartAmount();
  const total = subtotal + (subtotal > 0 ? DELIVERY_CHARGE : 0);

  return (
    <div className="cart-page">
      <div className="container">
        {/* Header */}
        <div className="cart-page__header animate-fadeUp">
          <h1 className="section-title">
            Your <span>Cart</span> 🛒
          </h1>
          <p className="section-subtitle">
            {cartList.length > 0
              ? `${cartList.length} item${cartList.length > 1 ? "s" : ""} in your cart`
              : "Your cart is empty"}
          </p>
        </div>

        {cartList.length === 0 ? (
          /* Empty State */
          <div className="cart-page__empty animate-scaleIn">
            <div className="cart-page__empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some delicious items from our menu!</p>
            <button className="btn-primary" onClick={() => navigate("/")}>
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="cart-page__content">
            {/* Item List */}
            <div className="cart-page__items animate-fadeUp">
              <div className="cart-page__items-header">
                <span>Items</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>

              {cartList.map((item) => (
                <div key={item._id} className="cart-page__item">
                  <div className="cart-page__item-info">
                    <img
                      src={`${url}/images/${item.image}`}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/60x60?text=Food";
                      }}
                    />
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.category}</p>
                    </div>
                  </div>
                  <div className="cart-page__item-price">₹{item.price}</div>
                  <div className="cart-page__item-qty">
                    <button
                      className="cart-page__qty-btn"
                      onClick={() => removeFromCart(item._id)}
                    >
                      −
                    </button>
                    <span>{cartItems[item._id]}</span>
                    <button
                      className="cart-page__qty-btn cart-page__qty-btn--add"
                      onClick={() => addToCart(item._id)}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-page__item-total">
                    ₹{item.price * cartItems[item._id]}
                  </div>
                  <button
                    className="cart-page__remove"
                    onClick={() => {
                      for (let i = 0; i < cartItems[item._id]; i++) {
                        removeFromCart(item._id);
                      }
                    }}
                    title="Remove"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cart-page__summary animate-fadeUp">
              <h3>Order Summary</h3>

              <div className="cart-page__summary-rows">
                <div className="cart-page__summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="cart-page__summary-row">
                  <span>Delivery Charge</span>
                  <span>₹{DELIVERY_CHARGE}</span>
                </div>
                <div className="cart-page__summary-row cart-page__summary-total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="cart-page__promo">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Promo code"
                  id="promo-code-input"
                />
                <button className="btn-outline">Apply</button>
              </div>

              <button
                className="btn-primary cart-page__checkout-btn"
                onClick={() => {
                  if (!token) {
                    alert("Please login to place an order.");
                  } else {
                    navigate("/order");
                  }
                }}
              >
                Proceed to Checkout →
              </button>

              <button
                className="cart-page__continue"
                onClick={() => navigate("/")}
              >
                ← Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
