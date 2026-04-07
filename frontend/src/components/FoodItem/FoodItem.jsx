import React from "react";
import { useStore } from "../../context/store-context";
import "./FoodItem.css";

const FoodItem = ({ id, name, price, description, image, rating, preparationTime }) => {
  const { cartItems, addToCart, removeFromCart, url } = useStore();
  const quantity = cartItems[id] || 0;

  return (
    <div className="food-item card" id={`food-${id}`}>
      {/* Image */}
      <div className="food-item__image-wrapper">
        <img
          src={`${url}/images/${image}`}
          alt={name}
          className="food-item__image"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=Food";
          }}
        />
        {/* Cart Overlay */}
        <div className="food-item__overlay">
          {quantity === 0 ? (
            <button
              className="food-item__add-btn"
              onClick={() => addToCart(id)}
              aria-label={`Add ${name} to cart`}
            >
              + Add
            </button>
          ) : (
            <div className="food-item__qty-control">
              <button
                onClick={() => removeFromCart(id)}
                className="food-item__qty-btn"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="food-item__qty-num">{quantity}</span>
              <button
                onClick={() => addToCart(id)}
                className="food-item__qty-btn food-item__qty-btn--add"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="food-item__info">
        <div className="food-item__meta">
          <div className="food-item__rating">
            ⭐ {rating || 4.0}
          </div>
          <div className="food-item__time">
            🕐 {preparationTime || 30} min
          </div>
        </div>

        <h3 className="food-item__name">{name}</h3>
        <p className="food-item__desc">{description}</p>

        <div className="food-item__bottom">
          <span className="food-item__price">₹{price}</span>
          {quantity > 0 && (
            <span className="badge badge-orange">
              {quantity} in cart
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
