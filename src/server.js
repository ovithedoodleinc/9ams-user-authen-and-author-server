const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { authRouter } = require("./routes/auth.route");
const { shopRouter } = require("./routes/shop.route");

dotenv.config();

const PORT = process.env.PORT || 8080;

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (origin && origin.includes(process.env.ORIGIN)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/shops", shopRouter);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
