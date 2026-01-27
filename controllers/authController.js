import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User exists" });

  const user = await User.create({ name, email, password });

  res.status(201).json({
    token: jwt.sign({ id: user._id }, process.env.JWT_SECRET),
    user
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    token: jwt.sign({ id: user._id }, process.env.JWT_SECRET),
    user
  });
};
