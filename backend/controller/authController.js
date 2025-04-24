const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../model/userModel");
module.exports = {
  register: async (req, res) => {
    const { email, password, name } = req.body;

    // Unified validation
    const requiredFields = {
      name: "Name",
      email: "Email",
      password: "Password",
    };
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${label} is required` });
      }
    }

    try {
      // Check existing user and create in single DB operation
      const hashedPassword = await bcrypt.hash(password, 15);
      const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      // Simplified token payload
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "720h" }
      );

      return res.status(201).json({
        accessToken: token,
        user: { _id: user._id, name: user.name, email: user.email },
        message: "User registered successfully",
      });
    } catch (err) {
      if (err.code === 11000) {
        // MongoDB duplicate key error
        return res.status(409).json({ message: "User already exists" });
      }
      console.error("Registration error:", err);
      return res
        .status(500)
        .json({ message: err?.message || "Registration failed" });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Early validation
      if (!email || !password) {
        return res.status(400).json({
          message: !email ? "Email is required" : "Password is required",
        });
      }

      // Optimized database query with projection
      const user = await userModel
        .findOne({ email })
        // .select("email  password userRole _id")
        .lean(); // Convert to plain JS object faster

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Parallel execution of bcrypt and JWT prep
      const [passwordMatch] = await Promise.all([
        bcrypt.compare(password, user.password),
        // Can add other parallel operations here if needed
      ]);

      if (!passwordMatch) {
        return res.status(401).json({ message: "password does not match" });
      }

      // Generate token with optimized expiration
      const token = jwt.sign(
        {
          email: user.email,
          userRole: user.userRole,
          createdAt: user.createdAt,
          _id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "720h" } // Always set expiration
      );

      // Minimal response payload
      return res.status(200).json({
        accessToken: token,
        message: "User login successfully",
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
          userRole: user.userRole,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: err?.message });
    }
  },
  logout: (req, res) => {
    // Dummy logout logic
    res.status(200).json({ message: "Logout successful" });
  },
};
