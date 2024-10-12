const { Post } = require('../models/postModel.js');
const { User } = require('../models/userModel.js');
const { Notification } = require('../models/notificationModel.js');
const { post } = require('../routes/postRoute.js');
const { error } = require('console');
const { $in } = require('sift');
const cloudinary = require("cloudinary").v2;

module.exports = {
    createPost: async (req, res) => {
        try {
            let { text, image } = req.body;
            let userId = req.user._id;

            if (!text && !image) {
                return res.status(400).json({ error: "Post must contain either text or an image" });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            if (image) {
                const uploadedImage = await cloudinary.uploader.upload(image);
                image = uploadedImage.secure_url;
            }

            const newPost = new Post({ text, image, user: userId });
            await newPost.save();

            return res.status(201).json({
                success: true,
                message: "Post created successfully",
                post: newPost
            });
        } catch (error) {
            console.error("Error at CreatePost controller: ", error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    getPost: async (req, res) => {
        try {
            const { postId } = req.params;
            const post = await Post.findById(postId).populate('user', '-password');

            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }

            return res.status(200).json({ post });
        } catch (error) {
            console.error("Error at GetPost controller: ", error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    deletePost: async (req, res) => {
        try {
            const { postId } = req.params;
            const post = await Post.findById(postId).populate('user', '-password');

            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }

            if (post.user._id.toString() !== req.user._id.toString()) {
                return res.status(401).json({ error: "You are not authorized to delete this post" });
            }

            if (post.image) {
                const publicId = post.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            const deletedPost = await Post.findByIdAndDelete(postId);
            return res.status(200).json({ message: "Post deleted successfully", deletedPost });
        } catch (error) {
            console.error("Error at deletePost controller: ", error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    getAllPosts: async (req, res) => {
        try {
            const allPosts = await Post.find({})
                .sort({ createdAt: -1 })
                .populate({ path: "user", select: "-password" })
                .populate({ path: "comments.user", select: "-password" });

            if (allPosts.length === 0) {
                return res.status(200).json({ message: "No posts found" });
            }

            return res.status(200).json({ allPosts });
        } catch (error) {
            console.error("Error at getAllPosts controller: ", error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    likeUnlikePost: async (req, res) => {
        try {
            const userId = req.user._id;
            const { postId } = req.params;

            const user = await User.findById(userId).select("-password");
            if (!user) return res.status(404).json({ error: "User not found" });

            const post = await Post.findById(postId);
            if (!post) return res.status(404).json({ error: "Post not found" });

            if (post.likes.includes(user._id)) {
                await Post.updateOne({ _id: post._id }, { $pull: { likes: user._id } });
                await User.updateOne({ _id: user._id }, { $pull: { likedPosts: post._id } });
                const updatedLikes = post.likes.filter(id => id.toString() !== user._id.toString());
                return res.status(200).json({ message: "Post unliked", updatedLikes });
            } else {
                await Post.updateOne({ _id: post._id }, { $push: { likes: user._id } });
                await User.updateOne({ _id: user._id }, { $push: { likedPosts: post._id } });

                const notification = new Notification({
                    from: user._id,
                    to: post.user,
                    type: 'like',
                });
                await notification.save();

                const updatedLikes = [...post.likes, user._id];
                return res.status(200).json({ message: "Post liked", updatedLikes });
            }
        } catch (error) {
            console.error("Error at likeUnlikePost controller: ", error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    commentOnPost: async (req, res) => {
        try {
            const userId = req.user._id;
            const { postId } = req.params;
            const { text } = req.body;

            if (!text) {
                return res.status(400).json({ error: "Comment text is required" });
            }

            const user = await User.findById(userId).select("-password");
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ error: "Post not found" });
            }

            const comment = { text, user: user._id };
            await Post.findByIdAndUpdate(postId, { $push: { comments: comment } });

            const notification = new Notification({
                from: user._id,
                to: post.user,
                type: "comment",
            });
            await notification.save();

            return res.status(200).json({ message: "Commented successfully" });
        } catch (error) {
            console.log("Error at commentOnPost controller: ", error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    getLikedPosts: async (req, res) => {
        try {
            const userId = req.user._id;
            const user = await User.findById(userId).select("-password");

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
                .populate({ path: "user", select: "-password" })
                .populate({ path: "comments.user", select: "-password" });

            if (likedPosts.length === 0) {
                return res.status(404).json({ message: "No liked posts found" });
            }

            return res.status(200).json(likedPosts);
        } catch (error) {
            console.error("Error at getLikedPosts controller: ", error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    getFollowingPosts: async (req, res) => {
        try {
            const userId = req.user._id;
            const user = await User.findById(userId).select("-password");

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const followingUsers = user.following;

            const feedPosts = await Post.find({ user: { $in: followingUsers } })
                .sort({ createdAt: -1 })
                .populate({ path: "user", select: "-password" })
                .populate({ path: "comments.user", select: "-password" });

            if (feedPosts.length === 0) {
                return res.status(404).json({ message: "No posts found from users you follow." });
            }

            return res.status(200).json({ feedPosts });
        } catch (error) {
            console.log("Error at getFollowingPosts controller: ", error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    getUserPosts: async (req, res) => {
        try {
            const userId = req.user._id;
    
            const user = await User.findById(userId).select("-password");
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
    
            const userPosts = await Post.find({ user: userId })
                .sort({ createdAt: -1 })
                .populate({
                    path: "user",
                    select: "-password",
                })
                .populate({
                    path: "comments.user",
                    select: "-password",
                });
    
            return res.status(200).json({ userPosts });
        } catch (error) {
            console.error("Error at getUserPosts controller: ", error.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

}
    
