const express = require("express");
const { createPayment, createQuerySignature } = require("../services/momo.service");
const { verifyMoMoSignature } = require("../utils/momo.verify");
const connectDB = require("../config/mongodb");
const Payment = require("../models/payment");

const router = express.Router();

// Create payment
router.post("/momo", async (req, res) => {
  try {
    await connectDB();

    const { amount } = req.body;

    const result = await createPayment(amount);

    await Payment.create({
      orderId: result.orderId,
      amount,
      status: "PENDING"
    });

    return res.json({
      success: true,
      payUrl: result.payUrl,
      orderId: result.orderId
    });
  } catch (err) {
    return res.status(500).json({ message: "Payment failed" });
  }
});

// ✅ MoMo IPN webhook
router.post("/momo/ipn", async (req, res) => {
  await connectDB();

  const isValid = verifyMoMoSignature(req.body);
  if (!isValid) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const { orderId, resultCode, message } = req.body;

  await Payment.findOneAndUpdate(
    { orderId },
    {
      resultCode,
      message,
      raw: req.body
    }
  );

  console.log("📩 IPN received:", orderId, resultCode);

  return res.status(200).json({ message: "OK" });
});

router.get("/", async (req, res) => {
  await connectDB();
  const data = await Payment.find().sort({ createdAt: -1 });
  res.json(data);
});

router.get("/momo/status/:orderId", async (req, res) => {
  await connectDB();

  const { orderId } = req.params;

  const payment = await Payment.findOne({ orderId });

  if (!payment) {
    return res.status(404).json({ message: "Not found" });
  }

  // Nếu đã SUCCESS thì trả luôn
  if (payment.status === "SUCCESS") {
    return res.json(payment);
  }

  // Gọi MoMo kiểm tra thật
  const signature = createQuerySignature(orderId);

  const payload = {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    requestId: orderId,
    orderId,
    lang: "vi",
    signature
  };

  const response = await fetch(
    "https://test-payment.momo.vn/v2/gateway/api/query",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );

  const data = await response.json();

  if (data.resultCode === 0) {
    payment.status = "SUCCESS";
  } else if (data.resultCode !== 1000) {
    payment.status = "FAILED";
  }

  payment.raw = data;
  await payment.save();

  return res.json(payment);
});

module.exports = router;