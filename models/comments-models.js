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
  return checksUserExists(username).then(() => {
    return db.query(
      `
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING * `,
      [username, body, article_id]
    );
  });
};

exports.selectCommentsByCommentId = (comment_id) => {
  return db.query(
    `
  SELECT * 
  FROM comments
  WHERE comment_id = $1
  `,
    [comment_id]
  );
};

exports.deletingCommentById = (comment_id) => {
  return db.query(
    `
  DELETE
  FROM comments
  WHERE comment_id = $1
  `,
    [comment_id]
  );
};

exports.patchCommentById = (comment_id, patch) => {
const {inc_votes} = patch
if(typeof inc_votes !== "number"){
  return Promise.reject({ status: 400, msg: "Invalid input" })
}
return db.query(`
UPDATE comments
SET votes = votes + $1
WHERE article_id = $2
RETURNING *
`, [inc_votes, comment_id])
}
