const functions = require("firebase-functions");
const mailgun = require("mailgun-js")({
  apiKey: "35b8f7d373def5863ad7cef24e9600fb-1c7e8847-8c66f2cc",
  domain: "sandboxcb19427ce0954ee79f5f13f34f305059.mailgun.org",
});
const fs = require("fs");
const path = require("path");


exports.sendVerificationEmail = functions.auth.user().onCreate(async (user) => {
  const email = user.email;

  const verificationCode = generateVerificationCode(); // Implement this function

  const templatePath = path.join(__dirname, "../../public/mail_verif.html");

  const template = fs.readFileSync(templatePath, "utf8");

  const emailContent = template
      .replace("[VerificationLink]", getVerificationLink(verificationCode));

  const data = {
    from: "IAMTIF@iamtif.firebaseapp.com",
    to: email,
    subject: "Verify Your Email Address",
    html: emailContent,
  };

  try {
    await mailgun.messages().send(data);
    console.log("Verification email sent");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
});


// eslint-disable-next-line require-jsdoc
function generateVerificationCode() {
  const {v4: uuidv4} = require("uuid");
  return uuidv4();
}

// eslint-disable-next-line require-jsdoc
function getVerificationLink(verificationCode) {
  // Construct the verification link with the generated verification code
  return `https://iamtif.firebaseapp.com/__/auth/action?mode=action&oobCode=${verificationCode}`;
}
