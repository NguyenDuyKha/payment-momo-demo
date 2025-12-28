const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: String,
    amount: Number,
    resultCode: Number,
    message: String,
    raw: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
