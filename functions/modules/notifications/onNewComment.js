const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.sendNotificationOnNewComment = functions.firestore
    .document("comments/{commentId}")
    .onCreate(async (snapshot, context) => {
      const commentData = snapshot.data();
      const postId = commentData.postId;

      const postSnapshot = await admin
          .firestore()
          .collection("posts")
          .doc(postId)
          .get();
      const postData = postSnapshot.data();

      // Get the FCM token of the post author
      const postAuthorId = postData.authorId; // Adjust this based on your data model
      const postAuthorSnapshot = await admin
          .firestore()
          .collection("users")
          .doc(postAuthorId)
          .get();
      const postAuthorData = postAuthorSnapshot.data();
      const postAuthorFcmToken = postAuthorData.fcmToken;

      if (!postAuthorFcmToken) {
        console.error("Post author has no FCM token");
        return null;
      }

      // Construct the notification payload
      const payload = {
        notification: {
          title: "New Comment",
          body: `${commentData.comment} - ${commentData.authorName}`,
          clickAction: "FLUTTER_NOTIFICATION_CLICK",
        },
      };

      try {
      // Send the notification to the post author
        const response = await admin
            .messaging()
            .sendToDevice(postAuthorFcmToken, payload);
        console.log("Notification sent successfully:", response);
        return null;
      } catch (error) {
        console.error("Error sending notification:", error);
        return null;
      }
    });
