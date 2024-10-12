const express = require('express');
const router = express.Router();

// Importing the notification controller functions
const {
  getNotifications,
  deleteNotifications
} = require('../controllers/notificationController.js');

// Importing the middleware to protect routes
const { protectRoute } = require('../middlewares/protectRoute.js');

// Route to get notifications (protected)
router.get("/", protectRoute, getNotifications);

// Route to delete notifications (protected)
router.delete("/", protectRoute, deleteNotifications);

// Exporting the router for use in the main application
module.exports = router;
