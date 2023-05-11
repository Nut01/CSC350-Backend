import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import userRouter from "./src/router/user.js";
import productRouter from "./src/router/product.js";
import giftRouter from "./src/router/gift.js";
import historyRouter from "./src/router/history.js";
import giftHistoryRouter from "./src/router/giftHistory.js";

const port = 4000;

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "https://csc-350-frontend.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/gift", giftRouter);
app.use("/history", historyRouter);
app.use("/giftHistory", giftHistoryRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
