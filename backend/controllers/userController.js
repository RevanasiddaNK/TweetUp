const { User } = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const { Notification } = require("../models/notificationModel.js");

module.exports = {
    getProfile: async (req, res) => {
        try {
            const { username } = req.params;  // Extract username from query params
            console.log(username);  // Log the extracted username
    
            if (!username) {
                return res.status(403).json({ message: "Invalid username" });
            }
    
            const user = await User.findOne({ username }).select("-password");  // Find the user by username
    
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
    
            return res.status(200).json(user);
    
        } catch (error) {
            console.error("Error in getting profile controller:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    followUnfollow: async (req, res) => {
        try {
            const id = req.user._id;
            const { followId } = req.params;

            if (followId.toString() === id.toString()) 
                return res.status(400).json({ message: "You cannot follow/unfollow yourself" });

            const user = await User.findById(id).select("-password");
            if (!user) 
                return res.status(401).json({ error: "You must be logged in" });

            const followUser = await User.findById(followId);
            if (!followUser) 
                return res.status(404).json({ error: "Follow user not found" });

            const isFollowing = user.following.includes(followUser._id);

            if (isFollowing) {
                await User.findByIdAndUpdate(user._id, { $pull: { following: followUser._id } });
                await User.findByIdAndUpdate(followUser._id, { $pull: { followers: user._id } });
                return res.status(200).json({ message: `You unfollowed ${followUser.username}` });
            } else {
                await User.findByIdAndUpdate(user._id, { $push: { following: followUser._id } });
                await User.findByIdAndUpdate(followUser._id, { $push: { followers: user._id } });

                const notification = new Notification({
                    from: user._id,
                    to: followUser._id,
                    type: 'follow',
                });
                await notification.save();

                return res.status(200).json({ message: `You are following ${followUser.username}` });
            }
        } catch (error) {
            console.error("Error in follow/unfollow controller:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getSuggestedUsers: async (req, res) => {
        try {
            const user = req.user;

            let usersToFollow = await User.aggregate([
                { $match: { _id: { $ne: user._id } } },
                { $sample: { size: 10 } }
            ]);

            usersToFollow = usersToFollow.filter(eachUser => !user.following.includes(eachUser._id));

            const data = usersToFollow.slice(0, 5);
            data.forEach(user => { user.password = null; });

            return res.status(200).json({data});
            
        } catch (error) {
            console.error("Error getting suggested users:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateUserDetails: async (req, res) => {
        try {
            const userID = req.user._id;
            const {
                username, email, currentPassword, newPassword,
                fullName, profileImage, coverImage, bio, link
            } = req.body;

            const userDetails = await User.findById(userID);

            if (!userDetails) 
                return res.status(404).json({ error: "User not found" });

            if ((!currentPassword && newPassword) || (currentPassword && !newPassword)) {
                return res.status(400).json({ error: "Please provide both current and new passwords" });
            }

            if (newPassword && currentPassword) {
                const isMatch = await bcrypt.compare(currentPassword, userDetails.password);
                if (!isMatch) 
                    return res.status(400).json({ error: "Invalid password" });

                if (newPassword.length < 6) 
                    return res.status(400).json({ error: "Password must be at least 6 characters long" });

                const salt = await bcrypt.genSalt(10);
                userDetails.password = await bcrypt.hash(newPassword, salt);
            }

            if (coverImage) {
                if (userDetails.coverImage) {
                    await cloudinary.uploader.destroy(userDetails.coverImage.split('/').pop().split('.')[0]);
                }
                userDetails.coverImage = (await cloudinary.uploader.upload(coverImage)).secure_url;
            }

            if (profileImage) {
                if (userDetails.profileImage) {
                    await cloudinary.uploader.destroy(userDetails.profileImage.split('/').pop().split('.')[0]);
                }
                userDetails.profileImage = (await cloudinary.uploader.upload(profileImage)).secure_url;
            }

            userDetails.username = username || userDetails.username;
            userDetails.fullName = fullName || userDetails.fullName;
            userDetails.email = email || userDetails.email;
            userDetails.bio = bio || userDetails.bio;
            userDetails.link = link || userDetails.link;

            await userDetails.save();
            userDetails.password = null;
            res.status(200).json({ success: "Profile updated successfully", userDetails });
        } catch (error) {
            console.error("Error updating user details:", error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
}
