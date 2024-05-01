const catchAsync = require("../utils/catchAsync");
const Category = require("../Model/category_model");
const Post = require("../Model/post_model");
const { successMessage } = require("../functions/utility_functions");
const AppError = require("../utils/appError");
// method POST
// route /api/v1/category
// @description Create a new category
// @privicy admin access this method
const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const categoryExist = await Category.findOne({ name });
  if (categoryExist) {
    return next(new AppError("Category already exists", 400));
  }
  const category = await Category.create({ name });
  return successMessage(202, res, "Category created", category);
});
// method PUT
// route /api/v1/category/:id
// @description Update a category by id
// @privicy admin access this method
const updateCategoryById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  return successMessage(202, res, "Category updated", category);
});
// method DELETE
// route /api/v1/category/:id
// @description Delete a category by id
// @privicy admin access this method
const deleteCategoryById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  return successMessage(202, res, "Category deleted", category);
});
// method GET
// route /api/v1/category
// @description Get all categories
// @privicy all access this method but with tokens
const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  return successMessage(202, res, "Categories fetched", categories);
});
// method GET
// route /api/v1/category/forAdmin
// @description Get all categories
// @privicy only admin access this method but with tokens
const getCategorieForAdmin = catchAsync(async (req, res, next) => {
  const categories = await Category.aggregate([
    {
      $lookup: {
        from: "posts", // Assuming your Post model is named 'Post'
        localField: "name",
        foreignField: "category",
        as: "posts",
      },
    },
    {
      $addFields: {
        noOfPosts: { $size: "$posts" },
      },
    },
    {
      $project: {
        posts: 0, // Exclude posts array from the result
      },
    },
  ]);

  return successMessage(202, res, "Category updated", categories);
});

module.exports = {
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getAllCategories,
  getCategorieForAdmin,
};
