const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));

module.exports = app;
