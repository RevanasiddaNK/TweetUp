const express = require('express');
const router = express.Router();

// Middleware to protect routes
const { protectRoute } = require("../middlewares/protectRoute.js");

// Importing post controller functions
const {
    createPost, 
    getPost, 
    deletePost,
    getAllPosts,
    likeUnlikePost,
    commentOnPost,
    getLikedPosts,
    getFollowingPosts,
    getUserPosts
} = require("../controllers/postController.js");

// Route to create a new post (protected)
router.post('/', protectRoute, createPost); 

// Route to get all posts (public)
router.get("/all", getAllPosts);

// Route to get posts from followed users (protected)
router.get("/feedPosts", protectRoute, getFollowingPosts);

// Route to get liked posts by the user (protected)
router.get('/likes/:userId', protectRoute, getLikedPosts); 

// Route to get posts by the logged-in user (protected)
router.get('/user/:username', protectRoute, getUserPosts);

// Route to get a specific post by ID (public)
router.get('/:postId', getPost);

// Route to delete a specific post by ID (protected)
router.delete('/:postId', protectRoute, deletePost);

// Route to like or unlike a post (protected)
router.put('/like/:postId', protectRoute, likeUnlikePost);

// Route to comment on a specific post (protected)
router.post('/comment/:postId', protectRoute, commentOnPost);

// Exporting the router for use in the main application
module.exports = router;
