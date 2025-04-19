const express = require("express");
const http = require("http");
const app = express();
const port = process.env.PORT || 9000;
const auth = require("json-server-auth");
const jsonServer = require("json-server");
const cors = require("cors")
// Configure CORS options
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:3000', // Update with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: corsOptions.origin, // Use the same origin as above
    methods: corsOptions.methods,
    credentials: corsOptions.credentials
  }
});
global.io = io;

const router = jsonServer.router("db.json");

router.render = (req, res) => {
  const path = req.path;
  const method = req.method;

  if (
    path.includes("/conversations") &&
    (method === "POST" || method === "PATCH")
  ) {
    io.emit("conversations", {
      data: res.locals.data,
    });
  }

  if (path.includes("/messages") && method === "POST") {
    io.emit("messages", {
      data: res.locals.data,
    });
  }

  res.json(res.locals.data);
};

// Update JSON Server default middlewares to include CORS
const middlewares = jsonServer.defaults({
  logger: false,
  static: 'node_modules/json-server/public',
  bodyParser: true,
  cors: corsOptions // Add CORS options here as well
});
app.use(middlewares);

// Bind the router db to the app
app.db = router.db;

// JSON Server Auth Rules
const rules = auth.rewriter({
  users: 640,
  conversations: 660,
  conversations_messages: 660, // changed from 'messages' for consistency
});

app.use(rules);
app.use(auth);
app.use(router);

// Listen using the HTTP server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
