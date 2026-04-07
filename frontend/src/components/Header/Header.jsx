import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <section className="header" id="home">
      {/* Background orbs */}
      <div className="header__orb header__orb--1" />
      <div className="header__orb header__orb--2" />
      <div className="header__orb header__orb--3" />

      <div className="container header__content">
        <div className="header__text animate-fadeUp">
          {/* Badge */}
          <div className="header__badge badge badge-orange">
            <span>🔥</span> #1 Food Delivery Platform
          </div>

          <h1 className="section-title header__title">
            Delicious Food,<br />
            <span>Delivered Fast</span> 🚀
          </h1>
          <p className="header__desc">
            Order from 500+ restaurants in your city. Fresh ingredients,
            amazing flavors, delivered to your door in 30 minutes or less.
          </p>

          {/* Search bar */}
          <div className="header__search">
            <div className="header__search-icon">📍</div>
            <input
              type="text"
              placeholder="Enter your delivery address..."
              className="header__search-input"
            />
            <button
              className="btn-primary header__search-btn"
              onClick={() => {
                document.getElementById("explore")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Find Food
            </button>
          </div>

          {/* Stats */}
          <div className="header__stats">
            <div className="header__stat">
              <span className="header__stat-num">500+</span>
              <span className="header__stat-label">Restaurants</span>
            </div>
            <div className="header__stat-divider" />
            <div className="header__stat">
              <span className="header__stat-num">50K+</span>
              <span className="header__stat-label">Happy Customers</span>
            </div>
            <div className="header__stat-divider" />
            <div className="header__stat">
              <span className="header__stat-num">30 min</span>
              <span className="header__stat-label">Avg Delivery</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="header__image animate-float">
          <div className="header__image-bg" />
          <div className="header__image-content">
            <div className="header__image-emoji">🍕</div>
            <div className="header__floating-badge header__floating-badge--1">
              <span>⭐</span> 4.9 Rating
            </div>
            <div className="header__floating-badge header__floating-badge--2">
              <span>🚀</span> Fast Delivery
            </div>
            <div className="header__floating-badge header__floating-badge--3">
              <span>💳</span> Safe Payment
            </div>
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="header__wave">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#FFFDF7" />
        </svg>
      </div>
    </section>
  );
};

export default Header;
