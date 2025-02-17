const express = require("express");

const apiRouter = require("./routers/api-router");

const app = express();

const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (!err.code) {
    return next(err);
  }
  if (err.code === "22P02") {
    res.status(400).send({ msg: "incorrect input" });
  }
});
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal server error" });
  }
});

module.exports = app;
