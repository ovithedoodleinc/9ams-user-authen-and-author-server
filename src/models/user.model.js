const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "username required"],
      minlength: [3, "username must be at least 3 characters"],
      maxlength: [32, "username must be in 32 characters"],
      unique: [true, "username must be unique"],
    },
    password: {
      type: String,
      required: [true, "password required"],
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel,
};
