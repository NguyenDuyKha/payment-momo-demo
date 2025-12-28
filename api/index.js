const express = require("express");
const cors = require("cors");
const paymentRoute = require("../routes/payment.route");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static("public"));

app.use("/api/payment", paymentRoute);

module.exports = app;
