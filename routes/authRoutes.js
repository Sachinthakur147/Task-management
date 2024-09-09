const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const rateLimit = require("express-rate-limit");
const authenticateToken = require("../middleware/authenticateToken");
const userController = require("../controllers/userController");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts from this IP, please try again later.",
});

router.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("username").not().isEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain a special character"),
  ],
  authController.register
);

router.post(
  "/login",
  loginLimiter,
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").not().isEmpty().withMessage("Password is required"),
  ],
  authController.login
);

router.post("/logout", authController.logout);

router.get("/profile", authenticateToken, authController.getUserProfile);

module.exports = router;
