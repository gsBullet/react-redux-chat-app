const jwt = require("jsonwebtoken");
require("dotenv").config();
const authMiddleware = (req, res, next) => {
  const getToken = req.headers["authorization"];
  const token = getToken && getToken.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    // console.log(`token`, decoded);
    req.user = decoded;
    next();
  });
 
};

module.exports = authMiddleware;
