const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.createFcmToken = functions.https.onCall(async (data, context) => {
  try {
    // Ensure the request is made by an authenticated user
    if (!context.auth) {
      throw new functions.https.HttpsError(
          "unauthenticated",
          "Authentication required.",
      );
    }

    const {fcmToken} = data;
    const {uid} = context.auth;

    // Validate that the FCM token is provided
    if (!fcmToken) {
      throw new functions.https.HttpsError(
          "invalid-argument",
          "FCM token is required.",
      );
    }

    console.log("Create FCM Token:", {uid, fcmToken});

    // Update the user document in Firestore with the FCM token
    await admin.firestore().collection("users").doc(uid).update({
      fcmToken,
    });

    return {success: true, message: "FCM token created successfully."};
  } catch (error) {
    console.error("Error creating FCM token:", error);

    // Handle different types of errors and return appropriate response
    if (error instanceof functions.https.HttpsError) {
      throw error; // Re-throw HttpsError
    } else {
      throw new functions.https.HttpsError(
          "internal",
          "An internal error occurred while creating FCM token.",
      );
    }
  }
});
