import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  container: String,
  burnTime: String,
  waxType: String,
  weight: String,
  price: String,
  image: String,
  description: String,
  category: { type: String, enum: ["premium", "local"], default: "local" },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;



