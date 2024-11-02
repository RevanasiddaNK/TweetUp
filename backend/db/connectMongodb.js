const mongoose = require("mongoose");

const connectToDB = async () => {
    try {      
        //console.log(process.env.MONGO_URI);
        let connect = await mongoose.connect(process.env.MONGO_URI);  // Connect to MongoDB using the connection string from environment variables
        console.log(`MongoDB connected to server with host ${connect.connection.host}`);  // Log successful connection

        } 
    catch (error) {
        console.error(`Error connecting to MongoDB database: ${error.message}`);  // Log error message if connection fails
        process.exit(1);  // Exit the process with a failure status code
    }
};

module.exports = connectToDB;  // Export the function for use in other parts of the application
