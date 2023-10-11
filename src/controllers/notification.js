var Auth = require('../models/auth')
const admin = require('firebase-admin');
const serviceAccount = require('../config/smart-lunch-44a85-firebase-adminsdk-wspia-5f25e67145.json'); // Cần lấy serviceAccountKey từ Firebase Console
// Cấu hình Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

var sendFCMNotification = (fcmToken, message) => {
    const payload = {
        notification: {
            title: 'Thông báo',
            body: message
        }
    };

    admin.messaging().sendToDevice(fcmToken, payload)
        .then(response => {
            console.log('FCM notification sent successfully:', response);
        })
        .catch(error => {
            console.error('Error sending FCM notification:', error);
        });
}


exports.sendNotificationToUser = async (idUserSend, strMessage)  => {
   // Gửi thông báo FCM đến thiết bị của các tài khoản khác
    try{
        var user = await Auth.findById(idUserSend);
        if(user.tokenFcm != null){
            console.log(user);
            sendFCMNotification(user.tokenFcm, strMessage)  
        }
    }catch(e){

    }
}

