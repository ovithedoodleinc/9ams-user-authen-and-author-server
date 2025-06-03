const { ShopModel } = require("../models/shop.model");

const getAllShopsByUserController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch all shops for the given userId
    const shops = await ShopModel.find({ owner: userId });

    if (!shops || shops.length === 0) {
      return res.status(404).json({ error: "No shops found for this user" });
    }

    res.status(200).json({ success: true, shops });
  } catch (err) {
    console.error("Error fetching shops:", err);
    res.status(500).json({ error: "An error occurred while fetching shops" });
  }
};
module.exports = {
  getAllShopsByUserController,
};
