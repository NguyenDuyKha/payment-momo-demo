const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "momo",
  });

  console.log("✅ MongoDB connected");
};

module.exports = connectDB;
