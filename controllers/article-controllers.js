const { patch } = require("../app");
const {
  selectArticlesByID,
  selectAllArticles,
  patchingArticleWithId,
} = require("../models/article-models");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesByID(article_id)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }

      const article = rows[0];
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then(({ rows }) => {
      res.status(200).send({ articles: rows });
    })
    .catch(next);
};

exports.patchArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  const patch = req.body;

  selectArticlesByID(article_id)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      }
      return patchingArticleWithId(article_id, patch);
    })
    .then(({ rows }) => {
      const patchedArticle = rows[0];
      res.status(200).send(patchedArticle);
    })
    .catch(next);
};
