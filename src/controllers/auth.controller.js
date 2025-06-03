const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ShopModel } = require("../models/shop.model");
const { UserModel } = require("../models/user.model");

const signupController = async (req, res) => {
  try {
    const { shopNames, username, password } = req.body;

    // check shop names array is not empty
    if (!Array.isArray(shopNames) || shopNames.length === 0) {
      return res.status(400).json({
        error: "shop names must be a non-empty array",
      });
    }

    // check if shop names array is not containing empty strings
    if (
      shopNames.some((name) => typeof name !== "string" || name.trim() === "")
    ) {
      return res.status(400).json({
        error: "shop names must be non-empty strings",
      });
    }

    // check if shop names array is in the limit
    if (shopNames.length < 3 || shopNames.length > 4) {
      return res.status(400).json({
        error: "you can create a minimum 3 or maximum 4 shops",
      });
    }

    // check if shopNames array is not containing duplicates item in the request body
    const setOfShopNames = new Set(shopNames);
    if (setOfShopNames.size !== shopNames.length) {
      return res.status(400).json({
        error: "duplicate shop names detected",
      });
    }

    // check if a shop name does not exist in the database
    const shopNamesExistsPromises = shopNames.map((name) =>
      ShopModel.exists({
        name,
      })
    );
    const existingShopNames = await Promise.all(shopNamesExistsPromises);
    for (let I = 0; I < existingShopNames.length; I++) {
      if (existingShopNames[I]) {
        return res.status(400).json({
          error: `shop with name "${shopNames[I]}" already exists`,
        });
      }
    }

    // check password pattern
    const passwordPattern =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        error:
          "password must be at least 8 characters long, contain at least one special character, and one number",
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // all checks passed, proceed with user and shop creation
    const user = await UserModel.create({
      username,
      password: hashedPassword,
    });
    const shops = await ShopModel.insertMany(
      shopNames.map((name) => ({
        name,
        owner: user._id,
      }))
    );

    res.status(201).json({ success: true });
  } catch (err) {
    console.log("🚀 ~ signup ~ err:", err);

    res.status(400).json({
      error: err.message || "an error occurred during signup",
    });
  }
};

const signinController = async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;

    // find user by username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({
        error: "user not found",
      });
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        error: "incorrect password",
      });
    }

    // generate jwt token
    const payload = {
      _id: user._id,
      username: user.username,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? "7d" : "30m",
    });

    // set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000,
      // domain: process.env.DOMAIN,
      // sameSite: "lax",
      sameSite: "none",
      path: "/",
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.log("🚀 ~ signinController ~ err:", err);

    res.status(400).json({
      error: err.message || "an error occurred during signup",
    });
  }
};

const verifyController = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: "invalid token" });
  }
};

const logoutController = async (_, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: true,
    // domain: process.env.DOMAIN,
    // sameSite: "lax",
    sameSite: "none",
    path: "/",
  });

  res.status(200).json({ success: true, message: "Logged out" });
};

module.exports = {
  signupController,
  signinController,
  verifyController,
  logoutController,
};
