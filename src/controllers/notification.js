const admin = require('firebase-admin');
const serviceAccount = require('../androidnetworking-63dfb-firebase-adminsdk-pxqab-1d2c82f49e.json'); // Cần lấy serviceAccountKey từ Firebase Console
// Cấu hình Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

exports.findAndSendFCM = (idUserSend, strMessage) => {
   // Gửi thông báo FCM đến thiết bị của các tài khoản khác
    // if(user.tokenFCM != null){
    //     console.log(user);
    //     sendFCMNotification(user.tokenFCM, strMessage)  
    // }
}

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
