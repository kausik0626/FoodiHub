import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "./Orders.css";

const STATUS_OPTIONS = [
  "Food Processing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const Orders = () => {
  const { apiUrl, token, owner } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/order/list`, {
        headers: { token },
      });
      if (res.data.success) setOrders(res.data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const res = await axios.post(
        `${apiUrl}/api/order/status`,
        { orderId, status },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Status updated.");
        fetchOrders();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered =
    filterStatus === "All"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const stats = {
    total: orders.length,
    processing: orders.filter((o) => o.status === "Food Processing").length,
    outForDelivery: orders.filter((o) => o.status === "Out for Delivery").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
  };

  return (
    <div className="orders-page animate-up">
      <div className="orders-page__header">
        <div>
          <h2 className="admin-page-title">
            Manage <span>Orders</span>
          </h2>
          <p className="admin-page-subtitle">Showing orders assigned to {owner?.restaurantName}.</p>
        </div>
        <button className="btn-primary" onClick={fetchOrders} id="refresh-orders-btn">
          Refresh
        </button>
      </div>

      <div className="orders-page__stats">
        {[
          { label: "Total Orders", value: stats.total, color: "#667EEA" },
          { label: "Processing", value: stats.processing, color: "#F6AD55" },
          { label: "Out for Delivery", value: stats.outForDelivery, color: "#63B3ED" },
          { label: "Delivered", value: stats.delivered, color: "#68D391" },
        ].map((s) => (
          <div key={s.label} className="orders-page__stat card">
            <div className="orders-page__stat-val" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="orders-page__stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="orders-page__filters">
        {["All", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            className={`orders-page__filter-btn ${filterStatus === s ? "active" : ""}`}
            onClick={() => setFilterStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "var(--text-light)", textAlign: "center", padding: 40 }}>
          Loading orders...
        </p>
      ) : filtered.length === 0 ? (
        <div className="orders-page__empty">
          <span>Orders</span>
          <p>No orders found</p>
        </div>
      ) : (
        <div className="orders-page__list">
          {filtered.map((order, idx) => (
            <div
              key={order._id}
              className="orders-page__card card animate-up"
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              <div className="orders-page__card-top">
                <div className="orders-page__order-icon">ORD</div>
                <div className="orders-page__order-info">
                  <div className="orders-page__order-id">#{order._id.slice(-8).toUpperCase()}</div>
                  <div className="orders-page__order-date">
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="orders-page__order-amount">Rs {order.amount}</div>
              </div>

              <div className="orders-page__items">
                {order.items.map((item, i) => (
                  <span key={i} className="orders-page__item-tag">
                    {item.name} x{item.quantity}
                  </span>
                ))}
              </div>

              <div className="orders-page__address">
                {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipcode}
                <br />
                {order.address.phone} | {order.paymentMethod || "COD"} | {order.payment ? "Paid" : "Pending"}
              </div>

              <div className="orders-page__status-row">
                <select
                  className="orders-page__status-select input-field"
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  id={`status-${order._id}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <div className={`orders-page__badge orders-page__badge--${order.status.toLowerCase().replace(/ /g, "-")}`}>
                  {order.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
