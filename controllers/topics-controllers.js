const { selectTopics } = require("../models/topic-models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then(({ rows }) => {
      res.status(200).send({ rows });
    })
    .catch(next);
};
