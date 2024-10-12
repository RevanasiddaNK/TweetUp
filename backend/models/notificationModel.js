const mongoose = require("mongoose");
const { User } = require("./userModel.js");

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to the User model (sender of the notification)
        ref: "User",
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to the User model (receiver of the notification)
        ref: "User",
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['like', 'follow', 'comment']  // Type of notification
    },
    read: {
        type: Boolean,
        required: true,
        default: false  // Defaults to unread
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt fields
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notification };
