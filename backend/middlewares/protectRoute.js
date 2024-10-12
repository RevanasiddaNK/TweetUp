const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel.js");

module.exports = {
    protectRoute: async (req, res, next) => {
        try {
            const token = req.cookies.jwt;  // Get token from cookies

            if (!token) {
                return res.status(401).json({ error: "Unauthorized: Token not found!" });
            }

            const decode = jwt.verify(token, process.env.JWT_SECRET);  // Verify token

            if (!decode) {
                return res.status(401).json({ error: "Unauthorized: Invalid token!" });
            }

            const user = await User.findById(decode.userID).select("-password");  // Find user by ID without password

            if (!user) {
                return res.status(404).json({ error: "User not found!" });
            }

            req.user = user;  // Attach user to the request object
            next();  // Proceed to the next middleware or route handler
        } catch (error) {
            console.error(`Error at protectRoute Middleware: ${error.message}`);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};
