const {
  selectCommentsByArticleId,
  postingCommentToId,
  selectCommentsByCommentId,
  deletingCommentById,
  patchCommentById,
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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  selectCommentsByCommentId(comment_id)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment was not found" });
      }
      return deletingCommentById(comment_id);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
exports.patchingCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const patch = req.body;

  selectCommentsByCommentId(comment_id)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comments not found" });
      }
      return patchCommentById(comment_id, patch);
    })
    .then(({ rows }) => {
      const patchedComment = rows[0];
      res.status(200).send(patchedComment);
    })
    .catch(next);
};
