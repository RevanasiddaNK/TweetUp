const mongoose = require('mongoose');
const { User } = require('../models/userModel.js'); // Reference to User model

const postSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      trim: true,  // Trims whitespace
      maxlength: 500  // Limits post text length
    },
    image: {
      type: String  // Optional: Stores URL of an image
    },
    comments: [
      {
        text: {
          type: String,
          required: true,
          maxlength: 200  // Limits comment text length
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        }
      }
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true  // Adds createdAt and updatedAt fields
  }
);

const Post = mongoose.model('Post', postSchema);
module.exports = { Post };
