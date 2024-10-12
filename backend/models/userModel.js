const mongoose = require("mongoose");
const { Post } = require("../models/postModel.js");

// Define userSchema for user collection
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      trim: true
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true
    },

    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"]
    },

    profileImage: {
      type: String,
      default: "", // Can store URL of the user's profile image
      trim: true
    },

    coverImage: {
      type: String,
      default: "", // Can store URL of the user's cover image
      trim: true
    },

    bio: {
      type: String,
      default: "",
      maxlength: [160, "Bio cannot be more than 160 characters"]
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to other users
        default: []
      }
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to users the current user follows
        default: []
      }
    ],

    links: [
      {
        type: String,
        trim: true,
        default: []
      }
    ],

    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Reference to liked posts from Post model
        default: []
      }
    ]
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export User model
const User = mongoose.model("User", userSchema);

module.exports = { User };
