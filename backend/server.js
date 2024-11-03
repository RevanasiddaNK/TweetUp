const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoute = require("./routes/authRoute.js");
const userRoute = require("./routes/userRoute.js");
const postRoute = require("./routes/postRoute.js");
const notificationRoute = require("./routes/notificationRoute.js");
const connectToDB = require("./db/connectMongodb.js");

// Middlewares

// Middleware to parse incoming JSON requests with a maximum payload size of 10 MB.
// This is useful for handling JSON request bodies, allowing the server to accept
// and process JSON data sent in HTTP requests. Setting a size limit helps prevent
// performance issues or potential server overload from excessively large payloads.
app.use(express.json({ limit: "10mb" }));
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

const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Start server


app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
    connectToDB();
});

