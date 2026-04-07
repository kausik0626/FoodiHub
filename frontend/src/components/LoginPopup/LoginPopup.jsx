import React, { useState } from "react";
import axios from "axios";
import { useStore } from "../../context/store-context";
import { toast } from "react-toastify";
import "./LoginPopup.css";

const LoginPopup = ({ setShowLogin }) => {
  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { url, setToken } = useStore();

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint =
        currentState === "Login"
          ? `${url}/api/user/login`
          : `${url}/api/user/register`;
      const payload =
        currentState === "Login"
          ? { email: data.email, password: data.password }
          : data;

      const res = await axios.post(endpoint, payload);
      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        toast.success(
          currentState === "Login"
            ? "Welcome back! 🎉"
            : "Account created! Welcome 🎉"
        );
        setShowLogin(false);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowLogin(false)}>
      <div
        className="login-popup animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="login-popup__header">
          <div className="login-popup__logo">🍕</div>
          <h2>{currentState === "Login" ? "Welcome Back!" : "Create Account"}</h2>
          <p>
            {currentState === "Login"
              ? "Sign in to your FoodieHUB account"
              : "Join FoodieHUB and start ordering"}
          </p>
          <button
            className="login-popup__close"
            onClick={() => setShowLogin(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="login-popup__form">
          {currentState === "Sign Up" && (
            <div className="login-popup__field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={data.name}
                onChange={onChangeHandler}
                className="input-field"
                required
              />
            </div>
          )}

          <div className="login-popup__field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={onChangeHandler}
              className="input-field"
              required
            />
          </div>

          <div className="login-popup__field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min. 8 characters"
              value={data.password}
              onChange={onChangeHandler}
              className="input-field"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="btn-primary login-popup__submit"
            disabled={loading}
          >
            {loading ? (
              <span className="login-popup__loader" />
            ) : currentState === "Login" ? (
              "Sign In →"
            ) : (
              "Create Account →"
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="login-popup__toggle">
          {currentState === "Login" ? (
            <p>
              New to FoodieHUB?{" "}
              <button onClick={() => setCurrentState("Sign Up")}>
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={() => setCurrentState("Login")}>Sign In</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
