var Auth = require('../models/auth')
const Notification = require('../models/notification'); 
const admin = require('firebase-admin');
const serviceAccount = require('../config/smart-lunch-44a85-firebase-adminsdk-wspia-5f25e67145.json'); // Cần lấy serviceAccountKey từ Firebase Console
// Cấu hình Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

var TYPE_LOGIN = "TYPE_LOGIN"
var TYPE_COUPONS = "TYPE_COUPONS"
var TYPE_CHAT = "TYPE_CHAT"
var TYPE_CALL_ANSWER = "TYPE_CALL_ANSWER"

var sendFCMNotification = (fcmToken, title, body, type, idUrl, imageUrl) => {
    const message = {
        notification: {
            title: String(title),
            body: String(body),
            icon: "ic_launcher",       
            color: "#FF000000",
            sound: "sound_notifi.mp3",  
            image: String(imageUrl),              // ảnh phụ 
        },
        data: {                     // data send về
            type:  String(type),
            idUrl: String(idUrl)
        },
    };

    const options = {
        android:{
            priority:"high",
            notification: {
                clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            },
          },
    }
      
    admin.messaging().sendToDevice(fcmToken, message, options)
        .then(response => {
            console.log('FCM notification sent successfully:', response);
        })
        .catch(error => {
            console.error('Error sending FCM notification:', error);
        });
}

// giửi đến 1 user
exports.sendNotificationToUser = async (userId, title, message, type)  => {
    try{
        var user = await Auth.findById(userId);
        if(user.tokenFcm != null){
            console.log(user);
            sendFCMNotification(user.tokenFcm, title, message,type,"myAvatarUrl")  
        }
    }catch(e){
        console.log(e);
    }
}

// giử đến nhiều user đã cho
exports.sendNotificationToManyUser = async (users, title, message)  => {
    try{
        users.array.forEach(user => {
            if(user.tokenFcm != null){
                console.log(user);
                sendFCMNotification(user.tokenFcm, title, message)  
            }
        });
    }catch(e){
        console.log(e);
    }
}

exports.sendNotificationToAllUserNotMe = async (userId, title, message)  => {
    try{
        var users = await Auth.find({ _id: { $ne: userId } })
        console.log(users);
        users.forEach(user => {
            if(user.tokenFcm != null){
                sendFCMNotification(user.tokenFcm, title, message)  
            }
        });
    }catch(e){
        console.log(e);
    }
}

exports.sendNotifiChat= async (toUserId, title, message, userId)  => {
    try{
        var user = await Auth.findById(toUserId)
        if(user.tokenFcm != null){
            sendFCMNotification(user.tokenFcm, title, message, TYPE_CHAT, userId, "myAvatarUrl")  
        }
    }catch(e){
        console.log(e);
    }
}

exports.sendNotifiCall= async (targetUserId, title, message, userId)  => {
    try{
        var user = await Auth.findById(targetUserId)
        if(user.tokenFcm != null){
            sendFCMNotification(user.tokenFcm, title, message, TYPE_CALL_ANSWER, userId, "myAvatarUrl")  
        }
    }catch(e){
        console.log(e);
    }
}

exports.notifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const isRead = req.query.isRead;

        let userNotifications;
        if (isRead !== undefined) {
            userNotifications = await Notification.find({ userId, isRead }).sort({ timestamp: -1 });
        } else {
            userNotifications = await Notification.find({ userId }).sort({ timestamp: -1 });
        }

        res.status(200).json(userNotifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.readNotification = async (req, res) => {
    try {
      const notificationId = req.params.id;
      const notification = await Notification.findById(notificationId);
  
      if (!notification) {
        return res.status(404).json({ error: "Thông báo không tồn tại." });
      }
      notification.isRead = true;
      await notification.save();
      res.status(200).json(notification);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi trong quá trình xử lý." });
    }
  };


