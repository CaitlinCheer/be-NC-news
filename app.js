const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const {
  getArticlesById,
  getAllArticles,
} = require("./controllers/article-controllers");
const {
  getCommentsByArticleId,
  postCommentToId,
} = require("./controllers/comments-controllers");
const { getApi } = require("./controllers/api-controllers");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentToId);

app.use((err, req, res, next) => {
    // console.log(err)
  if (err.code === "22P02") {
    res.status(400).send({ msg: "incorrect input" });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
