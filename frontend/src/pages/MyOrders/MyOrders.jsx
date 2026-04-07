import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStore } from "../../context/store-context";
import "./MyOrders.css";

const MyOrders = () => {
  const { url, token } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.post(
          `${url}/api/order/userorders`,
          {},
          { headers: { token } }
        );
        if (res.data.success) setOrders(res.data.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token, url]);

  const refreshOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-orders">
      <div className="container">
        <div className="my-orders__header animate-fadeUp">
          <h1 className="section-title">
            My <span>Orders</span> 📦
          </h1>
          <p className="section-subtitle">
            Track your current and past orders
          </p>
        </div>

        {loading ? (
          <div className="my-orders__loading">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 140, marginBottom: 16, borderRadius: 16 }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="my-orders__empty animate-scaleIn">
            <div style={{ fontSize: 80 }}>📦</div>
            <h2>No orders yet</h2>
            <p>Your order history will appear here</p>
          </div>
        ) : (
          <div className="my-orders__list">
            {orders.map((order, idx) => (
              <div key={order._id} className="my-orders__card animate-fadeUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="my-orders__card-left">
                  <div className="my-orders__icon">🍕</div>
                  <div>
                    <h4>
                      {order.items
                        .map((i) => `${i.name} ×${i.quantity}`)
                        .join(", ")}
                    </h4>
                    <div className="my-orders__meta">
                      <span>📅 {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span>🍽️ {order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                      <span>💳 {order.paymentMethod || "COD"}</span>
                    </div>
                  </div>
                </div>

                <div className="my-orders__card-right">
                  <div className="my-orders__amount">₹{order.amount}</div>
                  <div className={`my-orders__status my-orders__status--${order.status.toLowerCase().replace(/ /g, "-")}`}>
                    {order.status === "Delivered" ? "✅" : order.status === "Out for Delivery" ? "🚴" : "⏳"}{" "}
                    {order.status}
                  </div>
                  <button
                    className="btn-outline my-orders__track"
                    onClick={refreshOrders}
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
