import React from "react";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { owner, logout } = useAuth();

  return (
    <header className="admin-navbar">
      <div className="admin-navbar__left">
        <h1>
          Welcome, <span>{owner?.name || "Owner"}</span>
        </h1>
        <p>Managing {owner?.restaurantName || "your restaurant"} on FoodieHUB</p>
      </div>
      <div className="admin-navbar__right">
        <div className="admin-navbar__badge">
          <span className="admin-navbar__dot" />
          System Online
        </div>
        <div className="admin-navbar__restaurant">{owner?.restaurantName}</div>
        <div className="admin-navbar__time">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
        <button className="admin-navbar__logout" onClick={logout} type="button">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
