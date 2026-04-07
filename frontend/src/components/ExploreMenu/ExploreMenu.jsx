import React from "react";
import "./ExploreMenu.css";

const categories = [
  { name: "All", icon: "🍽️" },
  { name: "Pizza", icon: "🍕" },
  { name: "Burgers", icon: "🍔" },
  { name: "Biryani", icon: "🍛" },
  { name: "Sushi", icon: "🍣" },
  { name: "Pasta", icon: "🍝" },
  { name: "Desserts", icon: "🍰" },
  { name: "Drinks", icon: "🥤" },
  { name: "Salads", icon: "🥗" },
  { name: "Sandwiches", icon: "🥪" },
];

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <section className="explore-menu" id="explore">
      <div className="container">
        <div className="explore-menu__header">
          <div>
            <p className="section-subtitle">What are you craving?</p>
            <h2 className="section-title">
              Explore Our <span>Menu</span>
            </h2>
          </div>
        </div>

        <div className="explore-menu__list">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`explore-menu__item ${
                category === cat.name ? "explore-menu__item--active" : ""
              }`}
              onClick={() =>
                setCategory(cat.name === category ? "All" : cat.name)
              }
              id={`category-${cat.name.toLowerCase()}`}
            >
              <div className="explore-menu__icon">{cat.icon}</div>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="explore-menu__divider">
          <div className="explore-menu__divider-line" />
          <span>🔥 Most Ordered</span>
          <div className="explore-menu__divider-line" />
        </div>
      </div>
    </section>
  );
};

export default ExploreMenu;
