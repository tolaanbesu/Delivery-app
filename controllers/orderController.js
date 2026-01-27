import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
  const order = await Order.create({
    user: req.user.id,
    ...req.body
  });
  res.status(201).json(order);
};

export const getOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.json(orders);
};
