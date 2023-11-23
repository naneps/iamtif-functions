const functions = require("firebase-functions");
const admin = require("firebase-admin");


// delete user on delete
exports.deleteUserOnDelete = functions.auth.user().onDelete((user) => {
  const {uid, email, displayName} = user;
  console.log("User deleted:", {uid, email, displayName});
  // Delete user information from your Firestore or database
  return admin.firestore().collection("users").doc(uid).delete();
});
