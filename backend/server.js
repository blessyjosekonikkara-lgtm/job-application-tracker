
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const applicationsRouter = require("./routes/applications");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Job Application Tracker API is running",
    data: null
  });
});

app.use("/api/applications", applicationsRouter);

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
