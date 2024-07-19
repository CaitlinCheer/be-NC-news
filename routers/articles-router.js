const articlesRouter = require("express").Router();
const {
  getArticlesById,
  getAllArticles,
  patchArticlesById,
} = require("../controllers/article-controllers");

const {
  getCommentsByArticleId,
  postCommentToId,
} = require("../controllers/comments-controllers");

articlesRouter.get("/", getAllArticles);

articlesRouter.get("/:article_id", getArticlesById);

articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

articlesRouter.post("/:article_id/comments", postCommentToId);

articlesRouter.patch("/:article_id", patchArticlesById);

module.exports = articlesRouter;
