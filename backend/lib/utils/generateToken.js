const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (userID, res) => {

    const token = jwt.sign( 
        { userID }, 
        process.env.JWT_SECRET, 
        { expiresIn: "15d" }  // Token expiration set to 15 days
    );

    res.cookie(
        "jwt",  // Cookie name
        token,  // Token value
        {
            maxAge: 15 * 24 * 60 * 60 * 1000,  // 15 days in milliseconds
            httpOnly: true,  // Cookie is inaccessible to JavaScript (helps prevent XSS attacks)
            sameSite: "strict",  // Prevents CSRF attacks
            secure: process.env.NODE_ENV !== 'development',  // Cookie is sent only over HTTPS in production
        }
    );
};

module.exports = { generateTokenAndSetCookie };
