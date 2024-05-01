// user_routes.js

const express = require("express");
const router = express.Router();
const {
  createPost,
  updatePostById,
  deletePostById,
} = require("../Controller/post_controller");
const { verifyToken } = require("../utils/verifyToken_util");
// models
const user_model = require("../Model/user_model");
/**
 * @swagger
 * /api/v1/post:
 *   post:
 *     summary: Create a new post.
 *     description: Create a new post with the provided data.
 *     tags:
 *       - User/Post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - image
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post.
 *               description:
 *                 type: string
 *                 description: The description of the post.
 *               image:
 *                 type: string
 *                 format: base64
 *                 description: The image of the post in base64 format.
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of categories associated with the post.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: Post created successfully.
 */
router.post("/", verifyToken([user_model]), createPost);

/**
 * @swagger
 * /api/v1/post/{id}:
 *   put:
 *     summary: Update a post by ID.
 *     description: Update a post with the provided data by its ID.
 *     tags:
 *       - User/Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post.
 *               description:
 *                 type: string
 *                 description: The description of the post.
 *               image:
 *                 type: string
 *                 description: The image of the post.
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of categories associated with the post.
 *     responses:
 *       '200':
 *         description: Post updated successfully.
 */
router.put("/:id", verifyToken([user_model]), updatePostById);
/**
 * @swagger
 * /api/v1/post/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     description: Delete a post by its unique identifier.
 *     tags:
 *       - User/Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success message indicating the post was deleted successfully.
 */
router.delete("/:id", verifyToken([user_model]), deletePostById);

module.exports = router;
