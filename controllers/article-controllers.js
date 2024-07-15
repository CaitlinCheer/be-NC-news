const { selectArticles } = require("../models/article-models");

exports.getArticles = (req, res, next) => {
  const { article_id } = req.params;
  selectArticles(article_id)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }

      const article = rows[0];
      res.status(200).send({ article });
    })
    .catch(next);
};
