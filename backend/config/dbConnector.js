
require("dotenv").config();

module.exports = process.env.MONGODB_URL;
// module.exports = process.env.MONGODB_URL || "mongodb://localhost:27017/CHATAPP";