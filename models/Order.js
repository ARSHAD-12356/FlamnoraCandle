import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    userId: { type: String, required: false }, // Will store user ID from session
    name: { type: String, required: false },
    email: { type: String, required: false },
  },
  products: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  payment: {
    method: String,
    status: { type: String, default: "Pending" },
    amount: Number,
    paymentId: { type: String, required: false },
  },
  orderDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;





