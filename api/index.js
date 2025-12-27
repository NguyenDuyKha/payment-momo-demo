import express from "express";
import cors from "cors";
import paymentRoute from "../routes/payment.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.use("/api/payment", paymentRoute);

// Health check
app.get("/api", (req, res) => {
  res.json({ status: "API is running" });
});

export default app;
