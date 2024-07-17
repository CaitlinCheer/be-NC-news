const db = require("../db/connection");
const { checksUserExists } = require("./users-models");

exports.selectCommentsByArticleId = (article_id) => {
  return db.query(
    `
    SELECT 
    comments.comment_id,
    comments.votes,
    comments.created_at,
    comments.author,
    comments.body,
    comments.article_id

    FROM 
    comments

    WHERE
    comments.article_id = $1
    `,
    [article_id]
  );
};

exports.postingCommentToId = (article_id, comment) => {
  const { username, body } = comment;

  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  return checksUserExists(username)
  .then(() => {
    return db.query(
      `
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING * `,
      [username, body, article_id]
    );
  });
};
