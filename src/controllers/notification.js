var Auth = require('../models/auth')
const admin = require('firebase-admin');
const serviceAccount = require('../config/smart-lunch-44a85-firebase-adminsdk-wspia-5f25e67145.json'); // Cần lấy serviceAccountKey từ Firebase Console
// Cấu hình Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

var TYPE_LOGIN = "TYPE_LOGIN"
var TYPE_CHAT = "TYPE_CHAT"

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
        }
    };

    const options = {
        android:{
            priority:"high"
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

// giử đến 1 user
exports.sendNotificationToUser = async (userId, title, message)  => {
    try{
        var user = await Auth.findById(userId);
        if(user.tokenFcm != null){
            console.log(user);
            sendFCMNotification(user.tokenFcm, title, message)  
        }
    }catch(e){

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


