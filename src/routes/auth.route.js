const express = require("express");
const {
  signupController,
  signinController,
  verifyController,
  logoutController,
} = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/signup", signupController);
authRouter.post("/signin", signinController);
authRouter.post("/logout", logoutController);

authRouter.get("/verify", verifyController);

module.exports = {
  authRouter,
};
