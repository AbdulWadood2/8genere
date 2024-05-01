// category_routes.js
const express = require("express");
const router = express.Router();
const {
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getAllCategories,
  getCategorieForAdmin,
} = require("../Controller/category_controller");
const { verifyToken } = require("../utils/verifyToken_util");
// models
const admin_model = require("../Model/admin_model");
const user_model = require("../Model/user_model");
/**
 * @swagger
 * /api/v1/category:
 *   post:
 *     summary: Create a new category.
 *     description: Create a new category with the provided name.
 *     tags:
 *       - Admin/Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '202':
 *         description: Category created successfully.
 */
router.post("/", verifyToken([admin_model]), createCategory);
/**
 * @swagger
 * /api/v1/category/{id}:
 *   put:
 *     summary: Update a category by ID.
 *     description: Update a category with the provided ID.
 *     tags:
 *       - Admin/Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the category.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '202':
 *         description: Category updated successfully.
 */
router.put("/:id", verifyToken([admin_model]), updateCategoryById);
/**
 * @swagger
 * /api/v1/category/{id}:
 *   delete:
 *     summary: Delete a category by ID.
 *     description: Delete a category with the provided ID.
 *     tags:
 *       - Admin/Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '202':
 *         description: Category deleted successfully.
 */
router.delete("/:id", verifyToken([admin_model]), deleteCategoryById);
/**
 * @swagger
 * /api/v1/category:
 *   get:
 *     summary: Get all categories.
 *     description: Retrieve all categories.
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '202':
 *         description: Categories fetched successfully.
 */
router.get("/", verifyToken([admin_model, user_model]), getAllCategories);
/**
 * @swagger
 * /api/v1/category/forAdmin:
 *   get:
 *     summary: Get all categories for admin
 *     description: Retrieves all categories along with the number of posts in each category.
 *     tags:
 *       - Admin/Category
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '202':
 *         description: Successfully retrieved categories for admin.
 */
router.get("/forAdmin", verifyToken([admin_model]), getCategorieForAdmin);
module.exports = router;
