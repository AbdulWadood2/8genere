// express
const express = require("express");
// express router
const ROUTE = express.Router();
// controller
const {
  login,
  logoutAdmin,
  dashboard,
  getAllUsers,
} = require("../Controller/admin_controller.js");
// authentication
const { verifyToken, refreshToken } = require("../utils/verifyToken_util.js");
// utilty functions
const { otpValidation } = require("../functions/utility_functions.js");
// model
const admin_model = require("../Model/admin_model.js");

/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     summary: Login to the admin panel
 *     description: Endpoint to login as an admin user.
 *     tags:
 *       - Admin/account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Admin email
 *               password:
 *                 type: string
 *                 description: Admin password
 *     responses:
 *       '202':
 *         description: Login successful
 */
ROUTE.route("/login").post(login);
/**
 * @swagger
 * /api/v1/admin/logout:
 *   post:
 *     summary: Logout admin.
 *     description: Logout the authenticated admin by clearing the refresh token and access token cookies.
 *     tags:
 *       - Admin/account
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
 *         description: Admin logged out successfully.
 */
ROUTE.route("/logout").post(verifyToken([admin_model]), logoutAdmin);
/**
 * @swagger
 * /api/v1/admin/refreshToken:
 *   get:
 *     summary: refresh Token api for admin.
 *     description:
 *       refresh Token api for admin
 *     tags:
 *       - Admin/account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '202':
 *         description: refreshToken success
 */
ROUTE.route("/refreshToken").get(refreshToken(admin_model));
/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: View dashboard route
 *     description: Endpoint to view the dashboard. Only accessible to admin users.
 *     tags:
 *       - Admin/account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully.
 *       401:
 *         description: Unauthorized, authentication credentials are missing or invalid.
 *       500:
 *         description: Internal server error.
 */
ROUTE.route("/dashboard").get(verifyToken([admin_model]), dashboard);
/**
 * @swagger
 * /api/v1/admin/allUsers:
 *   get:
 *     summary: Get all users
 *     description: Endpoint to retrieve all users. Only accessible to admin users.
 *     tags:
 *       - Admin/account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: List of users retrieved successfully.
 */
ROUTE.route("/allUsers").get(verifyToken([admin_model]), getAllUsers);

module.exports = ROUTE;
