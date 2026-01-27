import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: String,
    menu: [
      {
        name: String,
        price: Number
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
