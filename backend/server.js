const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
require("dotenv").config();

const authRoute = require("./routes/authRoute.js");
const userRoute = require("./routes/userRoute.js");
const postRoute = require("./routes/postRoute.js");
const notificationRoute = require("./routes/notificationRoute.js");
const connectToDB = require("./db/connectMongodb.js");

// Middleware
app.use(express.json({limit:"10mb"})); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(cookieParser());

// Use the cors middleware
app.use(cors({
    origin: 'http://localhost:3000' // Allow only the frontend origin
  }));

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.COUDINARY_API_KEY,
    api_secret: process.env.COUDINARY_API_SECRET
});

// Route handlers
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/notification", notificationRoute);

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
    connectToDB();
});
