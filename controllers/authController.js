const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const BlacklistToken = require("../models/BlacklistToken");
const User = require("../models/User");

const JWT_SECRET = "my_secret_key";

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      username,
      email,
      password,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log("Error details:", err);
    res.status(500).json({ message: "Error registering user" });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.log("Error details:", err);
    res.status(500).json({ message: "Error logging in" });
  }
};

exports.logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const blacklistedToken = new BlacklistToken({
      token: token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    await blacklistedToken.save();

    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.log("Error details:", err);
    res.status(500).json({ message: "Error logging out" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    console.log("Requesting user profile for:", req.user);

    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User profile found:", user);
    res.json(user);
  } catch (error) {
    console.log("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
