const functions = require("firebase-functions");
const admin = require("firebase-admin");


exports.sendNotificationOnNewPost = functions.firestore
    .document("posts/{postId}")
    .onCreate(async (snapshot, context) => {
      const postData = snapshot.data();

      const payload = {
        notification: {
          title: "New Post",
          body: postData.title, // You can customize this based on your data structure
        },
      };

      const tokensSnapshot = await admin.firestore().collection("users").get();
      const tokens = tokensSnapshot.docs.map((doc) => doc.data().fcmToken);

      const response = await admin.messaging().sendToDevice(tokens, payload);

      const results = response.results;
      const tokensToRemove = [];

      results.forEach((result, index) => {
        const error = result.error;
        if (error) {
          console.error("Failure sending notification to", tokens[index], error);
          if (
            error.code === "messaging/invalid-registration-token" ||
          error.code === "messaging/registration-token-not-registered"
          ) {
            tokensToRemove.push(tokensSnapshot.docs[index].ref.update({fcmToken: null}));
          }
        }
      });

      return Promise.all(tokensToRemove);
    });
