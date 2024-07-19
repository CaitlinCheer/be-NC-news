const apiRouter = require("express").Router();
const commentsRouter = require("./comments-router");
const usersRouter = require("./users-router");
const topicsRouter = require("./topics-router");
const articlesRouter = require("./articles-router");
const { getApi } = require("../controllers/api-controllers");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

apiRouter.get("/", getApi);

module.exports = apiRouter;
