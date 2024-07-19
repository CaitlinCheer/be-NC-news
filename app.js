const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const {
  getArticlesById,
  getAllArticles,
  patchArticlesById,
} = require("./controllers/article-controllers");
const {
  getCommentsByArticleId,
  postCommentToId,
  deleteCommentById,
} = require("./controllers/comments-controllers");

const { getAllUsers } = require("./controllers/users-controllers");
const { getApi } = require("./controllers/api-controllers");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getAllUsers);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentToId);

app.patch("/api/articles/:article_id", patchArticlesById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use((err, req, res, next) => {
  if (!err.code) {
    return next(err);
  }
  if (err.code === "22P02") {
    res.status(400).send({ msg: "incorrect input" });
  }
});
app.use((err, req, res, next) => {

  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal server error" });
  }
});

module.exports = app;
