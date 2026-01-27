import Restaurant from "../models/restaurant.model.js";

export const getRestaurants = async (_, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
};

export const createRestaurant = async (req, res) => {
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json(restaurant);
};
