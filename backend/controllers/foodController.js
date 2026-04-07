import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add food item
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
    ownerId: req.owner.id,
    restaurantName: req.owner.restaurantName,
    rating: req.body.rating || 4.0,
    preparationTime: req.body.preparationTime || 30,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food item added successfully!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to add food item." });
  }
};

// List all food items
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({ available: true });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to fetch food items." });
  }
};

// List owner food items
const listOwnerFood = async (req, res) => {
  try {
    const foods = await foodModel.find({ ownerId: req.owner.id });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to fetch your food items." });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findOne({ _id: req.body.id, ownerId: req.owner.id });
    if (!food) {
      return res.json({ success: false, message: "Food item not found." });
    }
    // Delete image file
    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) console.error("Image delete error:", err);
    });
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food item removed successfully!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to remove food item." });
  }
};

// Toggle availability
const toggleAvailability = async (req, res) => {
  try {
    const food = await foodModel.findOne({ _id: req.body.id, ownerId: req.owner.id });
    if (!food) {
      return res.json({ success: false, message: "Food item not found." });
    }
    food.available = !food.available;
    await food.save();
    res.json({ success: true, message: "Availability updated." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to update availability." });
  }
};

export { addFood, listFood, listOwnerFood, removeFood, toggleAvailability };
