const {Notification} = require("../models/notificationModel.js");

module.exports = {
    
    getNotifications: async (req, res) => {
        try {
            const userId = req.user._id;
    
            // Fetch notifications, sort by createdAt in descending order, and populate the 'from' field
            const notifications = await Notification.find({ to: userId })
                .sort({ createdAt: -1 })
                .populate({
                    path: "from",
                    select: " username profileImage"
                });
    
            // If no notifications are found, send a 404 response
            if (!notifications.length) {
                return res.status(404).json({ error: "No notifications found!" });
            }
    
            // Mark all fetched notifications as read
            await Notification.updateMany({ to: userId }, { isRead: true });
    
            // Send the notifications in the response
            return res.status(200).json({ notifications });
        } 
        catch (error) {
            console.log("Error at getNotification controller:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    },

    deleteNotifications: async (req, res) => {
        try {
            const userId = req.user._id;
    
            // Delete all notifications for the given userId
            const deletedNotification = await Notification.deleteMany({ to: userId });
    
            // If no notifications were deleted, send a 404 response
            if (deletedNotification.deletedCount === 0) {
                return res.status(404).json({ error: "No notifications found to delete" });
            }
    
            // Send a success message after successful deletion
            return res.status(200).json({ message: "Notifications deleted successfully" });
        } 
        catch (error) {
            console.log("Error at deleteNotifications controller:", error.message);
            res.status(500).json({ error: "Internal server error" });
        }
    },
    
}