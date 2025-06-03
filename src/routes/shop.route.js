const express = require("express");
const {
  getAllShopsByUserController,
} = require("../controllers/shop.controller");
const { verifyToken } = require("../middlewares/verifyToken");

const shopRouter = express.Router();

shopRouter.use(verifyToken);

shopRouter.get("/", getAllShopsByUserController);

module.exports = {
  shopRouter,
};
