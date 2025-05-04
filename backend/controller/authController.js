const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../model/userModel");
const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const serviceAccountKey = require("../firebase/serviceAccount.json");
require("../config/passport");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// const generateUserName = async (email) => {
//   const { nanoid } = await import("nanoid");
//   let userName = email.split("@")[0];
//   const isUniqueUserName = await userModel
//     .exists({ "name": userName })
//     .then((result) => result);
//   isUniqueUserName ? (userName += nanoid().substring(0, 5)) : "";
//   return userName;
// };

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
        { expiresIn: "1h" }
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

  googleAuth: async (req, res, next) => {
    const { accessToken } = req.body;
    try {
      const decodedUser = await getAuth().verifyIdToken(accessToken);
      let { name, email, picture } = decodedUser;
      // picture = picture.replace("s96-c", "s384-c");

      let user = await userModel.findOne({
        email,
      });

      if (user) {
        if (!user?.google_auth) {
          return res
            .status(403)
            .json({ message: "This user was signed up without Google" });
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
          { expiresIn: "1h" } // Always set expiration
        );

        return res.status(201).json({
          accessToken: token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            authImage: user.authImage,
          },
          message: "User registered successfully",
        });
      }
      const newUser = new userModel({
        name,
        email,
        authImage: picture,
        google_auth: true,
      });
      await newUser.save();

      const token = jwt.sign(
        {
          email: newUser.email,
          userRole: newUser.userRole,
          createdAt: newUser.createdAt,
          _id: newUser._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Always set expiration
      );

      return res.status(201).json({
        accessToken: token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          authImage: newUser.picture,
        },
        message: "User registered successfully",
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err.message || "Try with some other Google account" });
    }
  },

  githubAuth: async (req, res) => {
    const { accessToken } = req.body;
    try {
      const decodedUser = await getAuth().verifyIdToken(accessToken);
      let { name, email, picture } = decodedUser;
      // picture = picture.replace("s96-c", "s384-c");

      let user = await userModel.findOne({
        email,
      });

      if (user) {
        if (!user?.google_auth) {
          return res
            .status(403)
            .json({ message: "This user was signed up without Github" });
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
          { expiresIn: "1h" } // Always set expiration
        );

        return res.status(201).json({
          accessToken: token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            authImage: user.authImage,
          },
          message: "User registered successfully",
        });
      }
      const newUser = new userModel({
        name,
        email,
        authImage: picture,
        google_auth: true,
      });
      await newUser.save();

      const token = jwt.sign(
        {
          email: newUser.email,
          userRole: newUser.userRole,
          createdAt: newUser.createdAt,
          _id: newUser._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Always set expiration
      );

      return res.status(201).json({
        accessToken: token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          authImage: newUser.picture,
        },
        message: "User registered successfully",
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: err.message || "Try with some other Google account" });
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

      if (user?.google_auth) {
        return res
          .status(403)
          .json({ message: "This user was signed up with Google" });
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
        { expiresIn: "1h" } // Always set expiration
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
          authImage: user.authImage,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: err?.message });
    }
  },
  getUser: async (req, res) => {
    const { email } = req.params || {};
    const user = await userModel
      .findOne({ email })
      .select("name email _id authImage");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  },
  logout: (req, res) => {
    // Dummy logout logic
    res.status(200).json({ message: "Logout successful" });
  },
};
