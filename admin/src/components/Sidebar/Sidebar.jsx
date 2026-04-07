import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { icon: "Dashboard", label: "Dashboard", to: "/" },
  { icon: "Add", label: "Add Food", to: "/add" },
  { icon: "Menu", label: "Food List", to: "/list" },
  { icon: "Orders", label: "Orders", to: "/orders" },
];

const Sidebar = () => {
  const { owner } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span className="sidebar__logo-icon">FH</span>
        <div>
          <div className="sidebar__logo-text">FoodieHUB</div>
          <div className="sidebar__logo-sub">Owner Panel</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "sidebar__item--active" : ""}`
            }
          >
            <span className="sidebar__item-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">
            {(owner?.restaurantName || owner?.name || "O").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="sidebar__user-name">{owner?.restaurantName || "Restaurant"}</div>
            <div className="sidebar__user-role">{owner?.email || "Owner account"}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
