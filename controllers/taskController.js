const Task = require("../models/Task");
const User = require("../models/User");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    text,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

exports.createTask = async (req, res) => {
  const { title, description, dueDate, priority, status, assignedTo } =
    req.body;

  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      createdBy: req.user.userId,
    });

    await task.save();

    const assignedUser = await User.findById(assignedTo);
    if (assignedUser) {
      if (assignedUser.notificationPreferences.email) {
        await sendEmail(
          assignedUser.email,
          "New Task Assigned",
          `You have been assigned a new task: ${title}.`
        );
      }
    }

    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role === "Manager" &&
      task.assignedTo.toString() !== req.user.userId.toString() &&
      req.user.role !== "Admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(task, updates);
    await task.save();

    const assignedUser = await User.findById(task.assignedTo);
    if (assignedUser) {
      if (assignedUser.notificationPreferences.email) {
        await sendEmail(
          assignedUser.email,
          "Task Updated",
          `The task "${task.title}" has been updated.`
        );
      }
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task" });
  }
};

exports.assignTask = async (req, res) => {
  const { taskId, userId } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role !== "Admin" && req.user.role !== "Manager") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    task.assignedTo = userId;
    await task.save();

    if (user.notificationPreferences.email) {
      await sendEmail(
        user.email,
        "Task Assigned",
        `You have been assigned a new task: ${task.title}.`
      );
    }

    res.status(200).json({ message: "Task assigned successfully", task });
  } catch (err) {
    console.log("Error details:", err);
    res.status(500).json({ message: "Error assigning task" });
  }
};

// View Assigned Tasks
exports.viewAssignedTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const assignedTasks = await Task.find({ assignedTo: userId });

    res.status(200).json({
      success: true,
      data: assignedTasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Task Assignment
exports.updateTaskAssignment = async (req, res) => {
  const { taskId, newUserId } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const newUser = await User.findById(newUserId);
    if (!newUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role !== "Admin" && req.user.role !== "Manager") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    task.assignedTo = newUserId;
    await task.save();

    // Notify new user about the task assignment update
    if (newUser.notificationPreferences.email) {
      await sendEmail(
        newUser.email,
        "Task Assignment Updated",
        `The task "${task.title}" has been reassigned to you.`
      );
    }

    res
      .status(200)
      .json({ message: "Task assignment updated successfully", task });
  } catch (err) {
    console.log("Error details:", err);
    res.status(500).json({ message: "Error updating task assignment" });
  }
};
