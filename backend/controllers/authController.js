const { User } = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const { generateTokenAndSetCookie } = require("../lib/utils/generateToken.js");

module.exports = {

    // Sign up a new user
    signUp: async (req, res) => {
        try {
            const { username, fullName, email, password } = req.body;

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: "Invalid email format" });
            }

            // Check if email already exists
            const regEmail = await User.findOne({ email });
            if (regEmail) {
                return res.status(400).json({ error: `${email} is already registered with username ${regEmail.username}` });
            }

            // Check if username is taken
            const regUser = await User.findOne({ username });
            if (regUser) {
                return res.status(400).json({ error: `${username} is taken, please try another username` });
            }

            // Password length validation
            if (password.length < 6) {
                return res.status(400).json({ error: "Password length must be at least 6 characters" });
            }

            // Generate salt and hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const newUser = new User({
                username,
                fullName,
                email,
                password: hashedPassword,
            });

            if (newUser) {
                generateTokenAndSetCookie(newUser._id, res);
                await newUser.save();
                return res.status(201).json({
                    _id: newUser._id,
                    username: newUser.username,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    followers: newUser.followers,
                    following: newUser.following,
                    profileImage: newUser.profileImage,
                    coverImage: newUser.coverImage,
                });
            } else {
                return res.status(400).json({ error: "Invalid user data" });
            }
        } catch (err) {
            console.log(`Error in Signup Controller: ${err.message}`);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    // Check if user is authenticated
    authCheck: async (req, res) => {
        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json({ user });
        } catch (error) {
            console.log(`Error in authCheck controller: ${error.message}`);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    // Log in a user
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Find user by username
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Check if password is correct
            const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
            if (!isPasswordCorrect) {
                return res.status(401).json({ error: "Incorrect password, please try again" });
            }

            generateTokenAndSetCookie(user._id, res);
            return res.status(200).json({
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                followers: user.followers,
                following: user.following,
                profileImage: user.profileImage,
                coverImage: user.coverImage,
            });
        } catch (error) {
            console.log(`Error in login controller: ${error.message}`);
            return res.status(500).json({ error: `Internal server error: ${error.message}` });
        }
    },

    // Log out a user
    logout: async (req, res) => {
        try {
            res.clearCookie("jwt", { path: "/" });
            return res.status(200).json({ message: "Logged out successfully!" });
        } catch (error) {
            console.log(`Error in logout controller: ${error.message}`);
            return res.status(500).json({ error: `Internal server error: ${error.message}` });
        }
    },
};
