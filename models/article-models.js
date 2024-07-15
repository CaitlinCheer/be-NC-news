const db = require("../db/connection");

exports.selectArticles = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]);
};
