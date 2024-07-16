const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  return db.query(`
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
    `,[article_id]);
};
