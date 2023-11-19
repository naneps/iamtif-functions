const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Function untuk membuat user baru setelah registrasi berhasil
exports.createUserOnSignUp = functions.auth.user().onCreate((user) => {
  const {uid, email, displayName} = user;

  // Tambahkan informasi pengguna ke Firestore atau basis data Anda
  return admin.firestore().collection("users").doc(uid).set({
    email,
    displayName,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

// Fungsi utama yang memerlukan otentikasi
exports.mainFunction = functions.https.onCall(async (data, context) => {
  // Periksa apakah pengguna telah masuk
  if (!context.auth) {
    return {error: "Not authenticated"};
  }

  try {
    // Lakukan operasi utama di sini
    const result = "Main function executed successfully!";

    return {result};
  } catch (error) {
    console.error("Error in main function:", error);
    return {error: "An error occurred in the main function"};
  }
});
