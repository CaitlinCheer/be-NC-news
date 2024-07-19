const usersRouter = require("express").Router();
const {
  getAllUsers,
  getUsernameByUsername,
} = require("../controllers/users-controllers");

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getUsernameByUsername);

module.exports = usersRouter;
