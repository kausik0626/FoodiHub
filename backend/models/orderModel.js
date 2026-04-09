import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  ownerId: { type: String, required: true },
  restaurantName: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: {
    type: String,
    default: "Food Processing",
    enum: [
      "Food Processing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
  },
  date: { type: Date, default: Date.now() },
  payment: { type: Boolean, default: false },
  paymentMethod: { type: String, default: "COD", enum: ["COD", "Stripe", "Razorpay"] },
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
