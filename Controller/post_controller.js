// post_controller.js
// models
const Post = require("../Model/post_model");
const love_model = require("../Model/love_model");
const AppError = require("../utils/appError");
const {
  postSignUpValidate,
  postEditValidate,
} = require("../utils/joi_validator");
const { successMessage } = require("../functions/utility_functions");
const catchAsync = require("../utils/catchAsync");

// method POST
// route /api/v1/post
// @description Create a new post
const createPost = catchAsync(async (req, res, next) => {
  const dummyImage =
    "https://lh5.googleusercontent.com/proxy/t08n2HuxPfw8OpbutGWjekHAgxfPFv-pZZ5_-uTfhEGK8B5Lp-VN4VjrdxKtr8acgJA93S14m9NdELzjafFfy13b68pQ7zzDiAmn4Xg8LvsTw1jogn_7wStYeOx7ojx5h63Gliw";
  // Validate incoming post data
  const { error, value } = postSignUpValidate({
    ...req.body,
    image: dummyImage,
  });

  // If validation fails, return 400 Bad Request with validation error
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  // Create the post
  const newPost = await Post.create({
    userId: req.user.id,
    ...value,
  });

  // Respond with success
  return successMessage(201, res, "Post created successfully", newPost);
});

// method PUT
// route /api/v1/post/:id
// @description Update a post by ID
const updatePostById = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const dummyImage =
    "https://lh5.googleusercontent.com/proxy/t08n2HuxPfw8OpbutGWjekHAgxfPFv-pZZ5_-uTfhEGK8B5Lp-VN4VjrdxKtr8acgJA93S14m9NdELzjafFfy13b68pQ7zzDiAmn4Xg8LvsTw1jogn_7wStYeOx7ojx5h63Gliw";
  // Validate incoming post data
  const { error, value } = postEditValidate({
    ...req.body,
    image: dummyImage,
  });

  // If validation fails, return 400 Bad Request with validation error
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  // Find post by ID and update
  const updatedPost = await Post.findByIdAndUpdate(
    { _id: postId, userId: req.user.id },
    {
      ...value,
    },
    { new: true }
  );

  // If post not found, return error
  if (!updatedPost) {
    return next(new AppError("Post not found", 400));
  }

  // Respond with success
  return successMessage(200, res, "Post updated successfully", updatedPost);
});

// method DELETE
// route /api/v1/post/:id
// @description Delete a post by ID
const deletePostById = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError("Post not found", 400));
  }
  if (post.userId.toString() !== req.user.id) {
    return next(
      new AppError("You are not authorized to delete this post", 400)
    );
  }
  // Find post by ID and delete
  const deletedPost = await Post.findByIdAndDelete(postId);
  // If post not found, return error
  if (!deletedPost) {
    return next(new AppError("Post not found", 404));
  }
  if (deletedPost) {
    await love_model.deleteMany({
      userId: deletedPost.userId,
    });
  }

  // Respond with success
  return successMessage(200, res, "Post deleted successfully");
});

module.exports = {
  createPost,
  updatePostById,
  deletePostById,
};
