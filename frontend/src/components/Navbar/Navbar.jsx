import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../../context/store-context";
import "./Navbar.css";

const Navbar = ({ setShowLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { getTotalCartItems, token, setToken, setCartItems } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    navigate("/");
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <NavLink to="/" className="navbar__logo">
          <div className="navbar__logo-icon">🍕</div>
          <span className="navbar__logo-text">
            Foodie<span>HUB</span>
          </span>
        </NavLink>

        {/* Desktop Nav Links */}
        <ul className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          <li><NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink></li>
          <li><a href="#explore" onClick={() => setMenuOpen(false)}>Menu</a></li>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
          <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>

        {/* Right Actions */}
        <div className="navbar__actions">
          {/* Cart */}
          <button
            className="navbar__cart"
            onClick={() => navigate("/cart")}
            aria-label="Cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {getTotalCartItems() > 0 && (
              <span className="navbar__cart-badge animate-scaleIn">
                {getTotalCartItems()}
              </span>
            )}
          </button>

          {/* Auth */}
          {!token ? (
            <button
              className="btn-primary"
              id="navbar-login-btn"
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </button>
          ) : (
            <div className="navbar__user">
              <div className="navbar__user-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="navbar__dropdown">
                <button onClick={() => navigate("/myorders")}>
                  📦 My Orders
                </button>
                <button onClick={logout}>
                  🚪 Logout
                </button>
              </div>
            </div>
          )}

          {/* Hamburger */}
          <button
            className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
