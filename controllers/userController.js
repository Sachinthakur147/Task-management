const User = require("../models/User");

// Get the profile of the authenticated user
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    if (!["Admin", "Manager", "User"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User role updated successfully", user: updatedUser });
  } catch (err) {
    console.log("Error details:", err);
    res.status(500).json({ message: "Error updating user role" });
  }
};

exports.updateNotificationPreferences = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.notificationPreferences.email = email;
    await user.save();

    res
      .status(200)
      .json({ message: "Notification preferences updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating notification preferences" });
  }
};
