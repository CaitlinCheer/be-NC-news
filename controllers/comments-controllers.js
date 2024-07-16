const { selectCommentsByArticleId } = require("../models/comments-models.js");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No comments avaliable" });
      }
      res.status(200).send({ articleComments: rows });
    })
    .catch(next);
};
