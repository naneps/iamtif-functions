const createUserOnSignUp = require("./createUser");
const deleteUserService = require("./deleteUser");
const sendVerificationEmail = require("./sendVerifEmail");
module.exports = {
  createUserOnSignUp,
  deleteUserService,
  sendVerificationEmail,
};
