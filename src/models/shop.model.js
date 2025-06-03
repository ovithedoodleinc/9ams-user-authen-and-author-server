const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "shop name required"],
      minlength: [2, "shop name must be at least 2 characters"],
      maxlength: [32, "shop name must be in 32 characters"],
      unique: [true, "shop name must be unique"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "owner required"],
    },
  },
  { timestamps: true }
);

const ShopModel = mongoose.model("Shop", shopSchema);

module.exports = {
  ShopModel,
};
