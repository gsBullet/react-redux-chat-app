require("dotenv").config();
// require("./config/passport");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 9000;
const bodyParser = require("body-parser");
const formData = require("express-form-data");
const http = require("http");
const { Server } = require("socket.io");
// const passport = require("passport");

const server = http.createServer(app);

const allRoutes = require("./router/allRoutes");
const dbConnector = require("./config/dbConnector");

// 1. Fix CORS configuration
const corsOptions = {
  // origin: process.env.FRONTEND_URL,
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

// 2. Apply CORS middleware
app.use(cors(corsOptions));

// 3. Correct Socket.IO initialization
const io = new Server(server, {
  cors: corsOptions,
});

global.io = io;

// 5. Fix middleware order
app.set("json spaces", 4);
app.use(express.json());
app.use(bodyParser.json());
app.use(formData.parse());

// 6. Routes
// app.use(passport.initialize());
app.use(allRoutes());

// 7. Fix server startup
mongoose
  .connect(dbConnector)
  .then((a) => {
    console.log(a.connections[0].name, "Database Connected Successfully");

    // Start the HTTP server instead of Express app
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
