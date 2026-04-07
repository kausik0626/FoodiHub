import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  registerOwner,
  loginOwner,
  getOwnerProfile,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";
import ownerAuth from "../middleware/ownerAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.post("/owner/register", registerOwner);
userRouter.post("/owner/login", loginOwner);
userRouter.get("/owner/profile", ownerAuth, getOwnerProfile);

export default userRouter;
