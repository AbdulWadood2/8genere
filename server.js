const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const http = require("http"); // Import http module

// swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swaggerConfig.js");
const { SwaggerTheme } = require("swagger-themes");
const theme = new SwaggerTheme();
const options = {
  explorer: true,
  customCss: theme.getBuffer("dark"),
};
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
/* routes */
const adminRouter = require("./Route/admin_routes");
const userRouter = require("./Route/user_routes.js");
const postRouter = require("./Route/post_routes.js");
const categoryRouter = require("./Route/category_routes.js");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));
app.enable("trust proxy");
app.use(
  cors({
    origin: true, // Allow access from any origin
    credentials: true,
  })
);
app.options("*", cors());

app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

/* routes */
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/category", categoryRouter);

const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controller/error_controller");
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

app.use((err, req, res, next) => {
  return next(new AppError(err, 404));
});

const DB = process.env.mongo_uri;
const port = 24000;

const server = http.createServer(app); // Create HTTP server

const connectDB = async () => {
  try {
    console.log("DB Connecting ...");
    const response = await mongoose.connect(DB);
    if (response) {
      console.log("MongoDB connect successfully");

      server.listen(port, () => {
        // Start the server using server.listen
        console.log(`App run with url: http://localhost:${port}`);
      });
    }
  } catch (error) {
    console.log("error white connect to DB ==>  ", error);
  }
};
connectDB();
