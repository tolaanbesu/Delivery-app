import express from "express";
import {
  getRestaurants,
  createRestaurant
} from "../controllers/restaurant.controller.js";

const router = express.Router();

router.get("/", getRestaurants);
router.post("/", createRestaurant);

export default router;
