import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRouter.js";
import userRoutes from "./routes/userRouter.js";
import customerRoutes from "./routes/customerRouter.js";
import orderRoute from "./routes/orderRoute.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
// app.use(notFound)

const PORT = process.env.PORT || 8000;

connectDB();
app.get("/", (req, res) => {
   res.send("Running");
});

app.use("/api/product", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/order", orderRoute);
app.get("/api/config/paypal", (req, res) => {
   res.send(process.env.PAYPAL_CLIENT);
});
app.listen(PORT, console.log(`app running on port ${PORT}`));
