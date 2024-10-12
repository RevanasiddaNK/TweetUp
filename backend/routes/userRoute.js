const express = require('express');
const Router = express.Router();

// Importing controller functions
const { 
    getProfile, 
    followUnfollow, 
    getSuggestedUsers,
    updateUserDetails 
} = require('../controllers/userController.js');

// Middleware to protect routes
const { protectRoute } = require('../middlewares/protectRoute.js');

// Route to get a user's profile by username (public)
Router.get("/profile/:username", getProfile);

// Route to follow or unfollow a user (protected)
Router.post("/follow/:followId", protectRoute, followUnfollow);

// Route to get suggested users for the logged-in user (protected)
Router.get("/suggestedUsers", protectRoute, getSuggestedUsers);

// Route to update user details (protected)
Router.post("/updateUserDetails", protectRoute, updateUserDetails);

// Exporting the router for use in the main application
module.exports = Router;
