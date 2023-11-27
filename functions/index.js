const {
  auth, notifications,
} = require("./modules");
const admin = require("firebase-admin");
admin.initializeApp();
exports.sendVerificationEmail = auth.sendVerificationEmail;
exports.createUserOnSignUp = auth.createUserOnSignUp;
exports.sendNotificationOnNewPost = notifications.sendNotificationOnNewPost;
exports.sendNotificationOnNewComment = notifications.sendNotificationOnNewComment;
