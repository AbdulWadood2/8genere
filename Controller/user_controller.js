// user_controller.js

const User = require("../Model/user_model");
const AppError = require("../utils/appError");
const CryptoJS = require("crypto-js");
const {
  successMessage,
  userPasswordCheck,
  setCookie,
  logoutCookie,
} = require("../functions/utility_functions");
const catchAsync = require("../utils/catchAsync");
const {
  generateAccessTokenRefreshToken,
} = require("../utils/verifyToken_util");
// method POST
// route /api/v1/user/register/
// @desciption register the user
// privacy only user can do this
const register = catchAsync(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("User with this email already exists", 400));
  }

  // Encrypt the password
  const encryptedPassword = CryptoJS.AES.encrypt(
    password,
    process.env.CRYPTO_SEC
  ).toString();

  // Create the user
  const newUser = await User.create({
    fullName,
    email,
    password: encryptedPassword,
  });

  // Generate access token and refresh token
  const { refreshToken, accessToken } = generateAccessTokenRefreshToken(
    newUser._id
  );

  // Save the refresh token to the user document
  newUser.refreshToken.push(refreshToken);
  await newUser.save();
  // Remove sensitive fields from the newUser object
  newUser.password = undefined;
  newUser.refreshToken = undefined;

  // Respond with success
  return successMessage(202, res, "Registration successful", {
    ...JSON.parse(JSON.stringify(newUser)),
    accessToken,
    refreshToken,
  });
});
// method POST
// route /api/v1/user/login/
// @desciption login the user
// privacy only user can do this
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("No user found with this email", 400));
  }

  // Check if the password is correct
  userPasswordCheck(user, password);

  // Generate access token and refresh token
  const { refreshToken, accessToken } = generateAccessTokenRefreshToken(
    user._id
  );

  // Save the refresh token to the user document
  user.refreshToken.push(refreshToken);
  await user.save();
  // Remove sensitive fields from the user object
  user.password = undefined;
  user.refreshToken = undefined;
  // Respond with success
  return successMessage(202, res, "Login successful", {
    ...JSON.parse(JSON.stringify(user)),
    accessToken,
    refreshToken,
  });
});
// method POST
// route /api/v1/user/logout/
// @desciption logout the user
// privacy only user can do this
const logout = catchAsync(async (req, res, next) => {
  let { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new AppError("refreshToken required in body", 400));
  }
  // Find the user by refresh token
  const user = await User.findOneAndUpdate(
    { refreshToken: refreshToken }, // Find the document with the matching refreshToken
    { $pull: { refreshToken: refreshToken } }, // Pull the refreshToken from the array
    { new: true } // Return the modified document after update
  );
  if (!user) {
    return next(new AppError("You are not logged in", 400));
  }

  // Respond with success
  return successMessage(202, res, "Logout successful", null);
});

module.exports = {
  register,
  login,
  logout,
};
