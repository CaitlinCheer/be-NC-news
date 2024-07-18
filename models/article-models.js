const db = require("../db/connection");

exports.selectArticlesByID = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]);
};

exports.selectAllArticles = (sort_by = "created_at", order = "DESC") => {
  const acceptableSorts = [
    "created_at",
    "title",
    "topic",
    "author",
    "body",
    "article_img_url",
  ];
  const acceptableOrders = ["DESC", "ASC"];
  if (
    !acceptableSorts.includes(sort_by) ||
    !acceptableOrders.includes(order.toUpperCase())
  ) {
    return Promise.reject({ status: 400, msg: "incorrect input" });
  }

  const queryStr = `
    SELECT
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
    FROM
      articles
    LEFT JOIN 
      comments
    ON 
      articles.article_id = comments.article_id
    GROUP BY
      articles.article_id
    ORDER BY 
      ${sort_by} ${order.toUpperCase()};
  `;

  return db.query(queryStr);
};

exports.patchingArticleWithId = (article_id, patch) => {
  const { inc_votes } = patch;
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  return db.query(
    `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *
  `,
    [inc_votes, article_id]
  );
};
