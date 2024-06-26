// catch async
const catchAsync = require("../utils/catchAsync");
// jwt
const JWT = require("jsonwebtoken");
// app error
const AppError = require("./appError");
/* models */
const {
  generateRandomString,
  successMessage,
  setCookie,
} = require("../functions/utility_functions");

const signRefreshToken = (uniqueId) => {
  return JWT.sign({ uniqueId }, process.env.JWT_SEC);
};
const signAccessToken = (id, uniqueId) => {
  return JWT.sign({ id, uniqueId }, process.env.JWT_SEC, {
    expiresIn: process.env.expirydateAccessToken,
  });
};
const generateAccessTokenRefreshToken = (userId) => {
  const uniqueId = generateRandomString(10);
  const refreshToken = signRefreshToken(uniqueId);
  const accessToken = signAccessToken(userId, uniqueId);
  return { refreshToken, accessToken };
};
// Verify token and admin
const verifyToken = (model) => async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return next(new AppError("you are not login", 400));
    }
    token = token.split(" ");
    token = token[1];
    const payload = JWT.verify(token, process.env.JWT_SEC);
    let user;
    // const payloadunique = [];
    // for (let item of user.refreshToken) {
    //   const token = JWT.verify(item, process.env.JWT_SEC);
    //   payloadunique.push(token.uniqueId);
    // }
    // if (!payloadunique.includes(payload.uniqueId)) {
    //   return next(new AppError("Invalid Token", StatusCodes.UNAUTHORIZED));
    // }
    for (let item of model) {
      user = await item.findOne({
        _id: payload.id,
      });
      if (user) {
        break;
      }
    }
    if (!user) {
      return next(new AppError("Invalid refreshToken", 401));
    }
    const payloadunique = [];
    // Create an array of promises to verify each token
    const verifyTokenPromises = user.refreshToken.map((item) => {
      const payload = JWT.verify(item, process.env.JWT_SEC);
      payloadunique.push(payload.uniqueId);
    });

    // Execute all promises in parallel
    await Promise.all(verifyTokenPromises);
    try {
      const verified = JWT.verify(token, process.env.JWT_SEC);
      user = { id: verified.id };
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      return next(new AppError("Invalid Token", 401));
    }
  } catch (error) {
    return next(new AppError(error, 401));
  }
};
// refreshToken
const refreshToken = (model) =>
  catchAsync(async (req, res, next) => {
    let refreshToken = req.header("Authorization");
    if (!refreshToken) {
      return next(new AppError("you are not login", 400));
    }
    refreshToken = refreshToken.split(" ");
    refreshToken = refreshToken[1];

    // Retrieve the user from the database based on the refresh token
    let user = await model.findOne({ refreshToken: refreshToken });
    if (!user) {
      throw new Error("you are not login");
    }
    let payload = JWT.verify(refreshToken, process.env.JWT_SEC);
    const newAccessToken = signAccessToken(user._id, payload.uniqueId);
    return successMessage(202, res, "refresh token run successfully", {
      accessToken: newAccessToken,
    });
  });

module.exports = {
  generateAccessTokenRefreshToken,
  verifyToken,
  refreshToken,
};
