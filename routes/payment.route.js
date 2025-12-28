const express = require("express");
const { createPayment } = require("../services/momo.service");
const { verifyMoMoSignature } = require("../utils/momo.verify");

const fs = require('fs').promises;

const router = express.Router();

// Create payment
router.post("/momo", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const result = await createPayment(amount);

    return res.json({
      success: true,
      payUrl: result.payUrl
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Payment failed"
    });
  }
});

// ✅ MoMo IPN webhook
router.post("/momo/ipn", async (req, res) => {
  const isValid = verifyMoMoSignature(req.body);

  if (!isValid) {
    return res.status(400).json({
      message: "Invalid signature"
    });
  }

  const {
    orderId,
    resultCode,
    message,
    amount
  } = req.body;

  // Add file
  const data = await fs.readFile('payments.json', 'utf8');
  const payments = JSON.parse(data);
  payments.push({
    orderId,
    resultCode,
    message,
    amount
  });
  await fs.writeFile('payments.json', JSON.stringify(payments, null, 2));
  // Add file

  if (resultCode === 0) {
    console.log("✅ Payment success:", {
      orderId,
      amount
    });

    // TODO: Save order to DB
  } else {
    console.log("❌ Payment failed:", message);
  }

  return res.status(200).json({
    message: "IPN received"
  });
});

router.get("/", async (req, res) => {
  const data = await fs.readFile('payments.json', 'utf8');
  res.json(JSON.parse(data));
});

module.exports = router;
