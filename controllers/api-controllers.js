const apiData = require("../endpoints.json");

exports.getApi = (req, res, next) => {
res.status(200).send(apiData)
};
