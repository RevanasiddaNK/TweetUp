const express = require("express");
const Router = express.Router();

// Import controllers and middleware
const {
  signUp,
  login,
  logout,
  authCheck
} = require("../controllers/authController.js");
const { protectRoute } = require("../middlewares/protectRoute.js");

// Define routes

// User registration route
Router.post("/signUp", signUp);

// Authentication check route (protected)
Router.get("/authCheck", protectRoute, authCheck);

// User login route
Router.post("/login", login);

// User logout route
Router.post("/logout", logout);

// Export the Router to use in main app file
module.exports = Router;
