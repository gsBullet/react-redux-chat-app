const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const formData = require("express-form-data");
const allRoutes = require("./router/allRoutes");
const dbConnector = require("./config/dbConnector");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 9000;

// 1. Configure CORS options
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ], // Allowed headers
  credentials: true, // If you need to send cookies or auth headers
};

// 2. Use CORS middleware with the specified options
app.use(cors(corsOptions));

//   // 3. Handle preflight requests for all routes
//   app.options("*", cors(corsOptions));

// 4. Additional Middleware
app.set("json spaces", 4);
app.use(express.json());
app.use(bodyParser.json());
app.use(formData.parse());

// Basic Route
app.use(allRoutes());

mongoose
  .connect(dbConnector, {})
  .then((a) => {
    console.log(a.connections[0].name, "Database Connected Successfully");
    // Start App
    app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
