import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "./OwnerAuth.css";

const initialForm = {
  name: "",
  email: "",
  password: "",
  restaurantName: "",
};

const OwnerAuth = () => {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const { apiUrl, persistSession } = useAuth();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint =
      mode === "login" ? `${apiUrl}/api/user/owner/login` : `${apiUrl}/api/user/owner/register`;
    const payload =
      mode === "login"
        ? { email: form.email, password: form.password }
        : form;

    try {
      const res = await axios.post(endpoint, payload);
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      persistSession(res.data.token, res.data.owner);
      toast.success(mode === "login" ? "Owner login successful." : "Owner account created.");
    } catch (error) {
      console.error("Owner auth failed:", error);
      toast.error("Unable to continue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="owner-auth">
      <div className="owner-auth__panel">
        <div className="owner-auth__intro">
          <span className="owner-auth__eyebrow">FoodieHUB Owner Portal</span>
          <h1>{mode === "login" ? "Sign in to manage your restaurant" : "Create your owner account"}</h1>
          <p>
            {mode === "login"
              ? "Each restaurant owner gets a separate dashboard and only sees their own menu and orders."
              : "Register your restaurant and start managing menu items and delivery updates."}
          </p>
        </div>

        <form className="owner-auth__form card" onSubmit={onSubmit}>
          {mode === "register" && (
            <>
              <div className="owner-auth__field">
                <label htmlFor="owner-name">Owner Name</label>
                <input
                  id="owner-name"
                  className="input-field"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Rohit Sharma"
                  required
                />
              </div>

              <div className="owner-auth__field">
                <label htmlFor="restaurant-name">Restaurant Name</label>
                <input
                  id="restaurant-name"
                  className="input-field"
                  name="restaurantName"
                  type="text"
                  value={form.restaurantName}
                  onChange={onChange}
                  placeholder="Spice Garden"
                  required
                />
              </div>
            </>
          )}

          <div className="owner-auth__field">
            <label htmlFor="owner-email">Email</label>
            <input
              id="owner-email"
              className="input-field"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="owner@example.com"
              required
            />
          </div>

          <div className="owner-auth__field">
            <label htmlFor="owner-password">Password</label>
            <input
              id="owner-password"
              className="input-field"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="Minimum 8 characters"
              minLength={8}
              required
            />
          </div>

          <button className="btn-primary owner-auth__submit" type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <div className="owner-auth__switch">
            {mode === "login" ? (
              <p>
                New restaurant owner?{" "}
                <button type="button" onClick={() => setMode("register")}>
                  Create account
                </button>
              </p>
            ) : (
              <p>
                Already registered?{" "}
                <button type="button" onClick={() => setMode("login")}>
                  Sign in
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerAuth;
