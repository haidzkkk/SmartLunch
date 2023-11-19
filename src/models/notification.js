const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    image: String,
    timestamp: { type: Date, default: Date.now },
    title: String,
    content: String,
    type: String,
    idUrl: String,
    isRead: {type: Boolean, default: false} 
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
