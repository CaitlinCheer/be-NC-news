const db = require("../db/connection");

exports.checksUserExists = (username) => {
  return db
    .query(
      `
  SELECT *
  FROM users
  WHERE username = $1`,
      [username]
    )
    .then((response) => {
      const foundUserData = response.rows;
      if (foundUserData.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Name doesn't exist in database",
        });
      }
      return foundUserData;
    });
};

exports.selectAllUsers = () => {
  return db.query(`
  SELECT *
  FROM users
  `);
};

exports.selectUsernameByUsername = (username) => {
  return db.query(
    `
  SELECT * 
  FROM users
  WHERE username = $1`,
    [username]
  );
};
