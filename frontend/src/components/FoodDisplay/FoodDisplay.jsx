import React from "react";
import FoodItem from "../FoodItem/FoodItem";
import { useStore } from "../../context/store-context";
import "./FoodDisplay.css";

const FoodDisplay = ({ category }) => {
  const { food_list } = useStore();

  const filtered =
    category === "All"
      ? food_list
      : food_list.filter((item) => item.category === category);

  return (
    <section className="food-display">
      <div className="container">
        {filtered.length === 0 ? (
          <div className="food-display__empty">
            <div className="food-display__empty-icon">🍽️</div>
            <h3>No items found</h3>
            <p>Try selecting a different category</p>
          </div>
        ) : (
          <div className="food-display__grid">
            {filtered.map((item) => (
              <FoodItem
                key={item._id}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                rating={item.rating}
                preparationTime={item.preparationTime}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FoodDisplay;
