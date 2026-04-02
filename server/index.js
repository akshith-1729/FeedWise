const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/summarize", require("./routes/summarize"));


app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});