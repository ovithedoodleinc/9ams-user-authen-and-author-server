const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("mongodb connection successful");
  } catch (err) {
    console.log("🚀 ~ connectDB ~ err:", err);
  }
};

module.exports = {
  connectDB,
};
