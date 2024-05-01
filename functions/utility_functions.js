const AppError = require("../utils/appError");
// for send simply success responses
let successMessage = (statusCode, res, message, data) => {
  return res.status(statusCode).json({
    status: "success",
    data,
    message,
  });
};
// otp validation
const otpValidation = async (req, res, next) => {
  try {
    const { otp, encryptOtp } = req.query;
    // Decrypt the encrypted options and compare with the user-entered code
    const decrypted = CryptoJS.AES.decrypt(
      decodeURIComponent(encryptOtp),
      process.env.CRYPTO_SEC
    ).toString(CryptoJS.enc.Utf8);
    let otpData;
    try {
      otpData = JSON.parse(decrypted);
    } catch (error) {
      return next(
        new AppError(
          "Invalid encrypted options format.",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const { code, expirationTime } = otpData;
    // Check if the OTP has expired
    const currentTime = new Date().getTime();
    if (currentTime > expirationTime) {
      return next(
        new AppError("Verification code has expired.", StatusCodes.BAD_REQUEST)
      );
    }

    if (code != otp) {
      return next(
        new AppError("Invalid verification code.", StatusCodes.BAD_REQUEST)
      );
    }

    return successMessage(StatusCodes.ACCEPTED, res, "Correct OTP", null);
  } catch (error) {
    return next(new AppError(error, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};
// userPasswordCheck
const userPasswordCheck = (user, password) => {
  // this package for encryption
  const CryptoJS = require("crypto-js");
  const hashedPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.CRYPTO_SEC
  );
  const realPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
  if (password !== realPassword) {
    throw new AppError("password is incorrect", 400);
  }
};
// this will give us the random string by our length
let generateRandomString = (length) => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};
// setCookie
const setCookie = async (accessToken, refreshToken, res) => {
  const oneYearInMilliseconds = 365 * 24 * 60 * 60 * 1000; // milliseconds in one year
  const maxAge = 1000 * oneYearInMilliseconds; // 1000 years in milliseconds

  res.cookie("accessToken", accessToken, {
    maxAge: maxAge,
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: maxAge,
    path: "/",
  });
};
// logout cookie
const logoutCookie = async (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};
module.exports = {
  successMessage,
  otpValidation,
  userPasswordCheck,
  generateRandomString,
  setCookie,
  logoutCookie,
};
