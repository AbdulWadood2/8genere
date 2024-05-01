// app error
const AppError = require("../utils/appError");
// model
const admin_model = require("../Model/admin_model");
const user_model = require("../Model/user_model");
const post_model = require("../Model/post_model");
// password encryption
const CryptoJS = require("crypto-js");
// utility functions
const {
  successMessage,
  userPasswordCheck,
  generateRandomNumber,
  setCookie,
  logoutCookie,
} = require("../functions/utility_functions");
// catch async
const catchAsync = require("../utils/catchAsync");
const {
  generateAccessTokenRefreshToken,
} = require("../utils/verifyToken_util");

// method POST
// route /api/v1/admin/login
// @desciption the register request verified here with otp
// privacy only only user can do this
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const admin = await admin_model.findOne({ email });
  if (!admin) {
    return next(new AppError("not admin with this email", 400));
  }
  userPasswordCheck(admin, password);
  const {
    password: pass,
    refreshToken: refresh,
    ...filteredAdminFields
  } = JSON.parse(JSON.stringify(admin));
  const { refreshToken, accessToken } = generateAccessTokenRefreshToken(
    admin._id
  );
  admin.refreshToken.push(refreshToken);
  await admin.save();
  return successMessage(202, res, "login success", {
    ...filteredAdminFields,
    accessToken,
    refreshToken,
  });
});

// method POST
// route /api/v1/admin/logout
// @desciption logout admin
// privacy only admin can do this
const logoutAdmin = catchAsync(async (req, res) => {
  let { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new AppError("you are not login", 400));
  }
  const buyer = await admin_model.findOne({ refreshToken });
  if (!buyer) {
    return next(new AppError("you are not login", 400));
  }

  await admin_model.updateOne(
    { refreshToken: refreshToken },
    { $pull: { refreshToken: refreshToken } }
  );

  return successMessage(202, res, "logout successfully", null);
});

// method GET
// route /api/v1/admin/dashboard
// @desciption view dashboard route
// privacy only admin can do this
const dashboard = catchAsync(async (req, res, next) => {
  const [userCount, uniqueCategories, postCount] = await Promise.all([
    user_model.countDocuments(),
    post_model.distinct("category"),
    post_model.countDocuments(),
  ]);
  return successMessage(202, res, "dashboard home get successfully", {
    userCount,
    uniqueCategories: uniqueCategories.length,
    postCount,
  });
});
// method GET
// route /api/v1/admin/allUsers
// @desciption for get all users
// privacy only admin can do this
const getAllUsers = catchAsync(async (req, res, next) => {
  let users = await user_model
    .find()
    .sort({ createdAt: -1 })
    .select("-refreshToken -password");
  users = users.map(async (user) => {
    const post = await post_model.countDocuments({ userId: user._id });
    return {
      ...user,
      createdPosts: post,
    };
  });
});

module.exports = {
  login,
  logoutAdmin,
  dashboard,
  getAllUsers,
};
