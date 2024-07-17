const {
  selectCommentsByArticleId,
  postingCommentToId,
} = require("../models/comments-models.js");
const { selectArticlesByID } = require("../models/article-models.js");

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

exports.postCommentToId = (req, res, next) => {
  const { article_id } = req.params;
  const comment = req.body;

  selectArticlesByID(article_id)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      }
      return postingCommentToId(article_id, comment);
    })
    .then(({ rows }) => {
      const postedComment = rows[0];
      res.status(201).send(postedComment);
    })
    .catch(next);
};
