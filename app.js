const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const { getArticlesById, getAllArticles } = require("./controllers/article-controllers");
const { getApi } = require("./controllers/api-controllers");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id", getArticlesById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "incorrect input" });
  } else next(err);
})
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
