require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 9000;
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const formData = require("express-form-data");
const allRoutes = require("./router/allRoutes");
const dbConnector = require("./config/dbConnector");
const http = require("http");

const { Server } = require("socket.io");
const server = http.createServer(app);

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

// 3. Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

global.io = io;

app.use((req, res, next) => {
  const originalSend = res.send;

  res.send = (body) => {
    const path = req.path;
    const method = req.method;

    // Check if response is JSON
    if (typeof body === "object") {
      if (
        path.includes("/conversations") &&
        (method === "POST" || method === "PATCH")
      ) {
        io.emit("conversations", { data: body });
      }

      if (path.includes("/messages") && method === "POST") {
        io.emit("messages", { data: body });
      }
    }

    originalSend.call(res, body);
  };

  next();
});

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
