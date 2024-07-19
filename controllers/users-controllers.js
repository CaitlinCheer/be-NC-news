const {
  selectAllUsers,
  selectUsernameByUsername,
} = require("../models/users-models");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then(({ rows }) => {
      res.status(200).send({ allUsers: rows });
    })
    .catch(next);
};

exports.getUsernameByUsername = (req, res, next) => {
  const { username } = req.params;
  if (typeof username !== "string"|| !isNaN(username)) {
    return res.status(400).send({ msg: "incorrect input" });
  }
  selectUsernameByUsername(username)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "username not found" });
      }
      usernameData = rows[0];
      res.status(200).send({ usernameData });
    })
    .catch(next);
};
