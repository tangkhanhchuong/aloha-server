require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { ExpressPeerServer } = require("peer");
const path = require("path");
const morgan = require("morgan");

const { errorHandler, notFoundHandler } = require("./middleware/error.handler");
const { initSocketIo } = require("./helpers/socket");
const { logger } = require("./helpers/logger");
const { connectMongoDB } = require("./helpers/mongo");

const bootstrap = async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: process.env.CORS_DOMAIN,
    })
  );
  app.use(cookieParser());

  const http = require("http").createServer(app);
  initSocketIo(http);
  ExpressPeerServer(http, { path: "/" });

  app.use("/api/v1/auth", require("./routes/auth.router"));
  app.use("/api/v1/users", require("./routes/user.router"));
  app.use("/api/v1/posts", require("./routes/post.router"));
  app.use("/api/v1/conversations", require("./routes/conversation.router"));
  app.use("/api/v1/comments", require("./routes/comment.router"));
  app.use("/api/v1/notifications", require("./routes/notification.router"));
  app.use("/api/v1/messages", require("./routes/message.router"));
  app.use("/api/v1/files", require("./routes/file.router"));
  app.use(notFoundHandler);
  app.use(errorHandler);

  await connectMongoDB();

  if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
  }

  const port = process.env.PORT || 5000;
  http.listen(port, () => {
    logger.info(
      JSON.stringify({
        msg: `Server is running on port ${port}`,
      })
    );
  });
};

bootstrap();
