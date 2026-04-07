import express from "express";
import {
  addFood,
  listFood,
  listOwnerFood,
  removeFood,
  toggleAvailability,
} from "../controllers/foodController.js";
import multer from "multer";
import ownerAuth from "../middleware/ownerAuth.js";

const foodRouter = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

foodRouter.post("/add", ownerAuth, upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.get("/owner/list", ownerAuth, listOwnerFood);
foodRouter.post("/remove", ownerAuth, removeFood);
foodRouter.post("/toggle", ownerAuth, toggleAvailability);

export default foodRouter;
