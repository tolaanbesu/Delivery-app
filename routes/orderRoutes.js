import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createOrder,
  getOrders
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);

export default router;
