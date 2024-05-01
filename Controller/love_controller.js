//  love_controller.js
// app error handler
const AppError = require("../utils/appError");
// utility functions
const { successMessage } = require("../functions/utility_functions");
// catch async
const catchAsync = require("../utils/catchAsync");
// models
const love_model = require("../Model/love_model");
const user_model = require("../Model/user_model");
// method POST
// route /api/v1/love
// @description add or remove love to a post
const addRemoveLove = catchAsync(async (req, res, next) => {
  const { postId, love } = req.body;
  const loveExist = await love_model.findOne({ postId, userId: req.user.id });
  const user = await user_model.findOne({ userId: req.user.id });
  if (!user.love) {
    return next(new AppError("you have zero loves", 400));
  }
  if (user.love < love) {
    return next(new AppError(`you have only ${user.love} loves`, 400));
  }
  if (loveExist) {
    const love = await love_model.findOneAndDelete({
      postId,
      userId: req.user.id,
    });
    user.love = user.love + love;
    await user.save();
    return successMessage(202, res, "love removed successfully", null);
  } else {
    const newLove = await love_model.create({
      postId,
      userId: req.user.id,
      love,
    });
    user.love = user.love - newLove.love;
    await user.save();
    return successMessage(202, res, "love added successfully", null);
  }
});
// method GET
// route /api/v1/love
// @description purchase love
// const purchaseLove = catchAsync(async (req, res, next) => {
//     const love
// });

module.exports = {};
