const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Function create user on sign up
exports.createUserOnSignUp = functions.auth.user().onCreate((user) => {
  const {uid, email, displayName} = user;
  console.log("User created:", {uid, email, displayName});
  // Add user information to your Firestore or database
  return admin.firestore().collection("users").doc(uid).set({
    email,
    uid,
    avatar: "https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=Oreo",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
