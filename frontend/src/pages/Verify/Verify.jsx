import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useStore } from "../../context/store-context";
import { toast } from "react-toastify";
import "./Verify.css";

const Verify = () => {
  const { url, setCartItems } = useStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.post(`${url}/api/order/verify`, {
          success,
          orderId,
        });
        if (res.data.success) {
          toast.success("Payment successful! 🎉");
          setCartItems({});
          setTimeout(() => navigate("/myorders"), 3000);
        } else {
          toast.error("Payment failed. Order cancelled.");
          setTimeout(() => navigate("/"), 3000);
        }
      } catch {
        toast.error("Verification failed. Please contact support.");
        setTimeout(() => navigate("/"), 3000);
      }
    };
    verifyPayment();
  }, [navigate, orderId, setCartItems, success, url]);

  const isSuccess = success === "true";

  return (
    <div className="verify-page">
      <div className="verify-page__card animate-scaleIn">
        <div className={`verify-page__icon ${isSuccess ? "success" : "fail"}`}>
          {isSuccess ? "🎉" : "❌"}
        </div>
        <h2>{isSuccess ? "Payment Successful!" : "Payment Failed"}</h2>
        <p>
          {isSuccess
            ? "Your order has been placed. Redirecting to orders..."
            : "Your order was cancelled. Redirecting home..."}
        </p>
        <div className="verify-page__loader">
          <div className="verify-page__progress" />
        </div>
      </div>
    </div>
  );
};

export default Verify;
