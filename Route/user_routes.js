// user_routes.js

const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../Controller/user_controller");
const { verifyToken, refreshToken } = require("../utils/verifyToken_util");
// models
const user_model = require("../Model/user_model");

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: Register a new user
 *     description: Endpoint to register a new user.
 *     tags:
 *       - User/account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       '202':
 *         description: Registration successful
 */
router.post("/register", register);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Login as a user
 *     description: Endpoint to login as a user.
 *     tags:
 *       - User/account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       '202':
 *         description: Login successful
 */
router.post("/login", login);
/**
 * @swagger
 * /api/v1/user/logout:
 *   post:
 *     summary: Logout the user
 *     description: Logout the authenticated user by clearing the refresh token and access token cookies.
 *     tags:
 *       - User/account
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       '202':
 *         description: User logged out successfully.
 */
router.post("/logout", verifyToken([user_model]), logout);
/**
 * @swagger
 * /api/v1/user/refreshToken:
 *   get:
 *     summary: refresh Token api for user.
 *     description:
 *       refresh Token api for admin
 *     tags:
 *       - User/account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '202':
 *         description: refreshToken success
 */
router.get("/refreshToken", refreshToken(user_model));

module.exports = router;
