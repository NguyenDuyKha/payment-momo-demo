require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const paymentRoute = require("./routes/payment.route");
app.use("/api/payment", paymentRoute);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
