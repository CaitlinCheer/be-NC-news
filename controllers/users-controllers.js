const { selectAllUsers } = require("../models/users-models");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then(({ rows }) => {
      res.status(200).send({ allUsers: rows });
    })
    .catch(next);
};
