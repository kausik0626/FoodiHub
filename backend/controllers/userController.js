import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Create JWT token
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      restaurantName: user.restaurantName || "",
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists with this email." });
    }

    // Validate email & password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email." });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();
    const token = createToken(user);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Registration failed. Please try again." });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found. Please register." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password. Please try again." });
    }

    const token = createToken(user);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Login failed. Please try again." });
  }
};

// Register Owner
const registerOwner = async (req, res) => {
  const { name, email, password, restaurantName } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists with this email." });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email." });
    }

    if (!restaurantName?.trim()) {
      return res.json({ success: false, message: "Restaurant name is required." });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newOwner = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "owner",
      restaurantName: restaurantName.trim(),
    });

    const owner = await newOwner.save();
    const token = createToken(owner);

    res.json({
      success: true,
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role,
        restaurantName: owner.restaurantName,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Owner registration failed. Please try again." });
  }
};

// Login Owner
const loginOwner = async (req, res) => {
  const { email, password } = req.body;

  try {
    const owner = await userModel.findOne({ email, role: { $in: ["owner", "admin"] } });
    if (!owner) {
      return res.json({ success: false, message: "Owner account not found." });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password. Please try again." });
    }

    const token = createToken(owner);

    res.json({
      success: true,
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role,
        restaurantName: owner.restaurantName,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Owner login failed. Please try again." });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Could not fetch profile." });
  }
};

// Get Owner Profile
const getOwnerProfile = async (req, res) => {
  try {
    const owner = await userModel.findById(req.body.ownerId).select("-password");
    if (!owner || !["owner", "admin"].includes(owner.role)) {
      return res.json({ success: false, message: "Owner profile not found." });
    }

    res.json({
      success: true,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role,
        restaurantName: owner.restaurantName,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Could not fetch owner profile." });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  registerOwner,
  loginOwner,
  getOwnerProfile,
};
