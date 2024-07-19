const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  patchingCommentById
} = require("../controllers/comments-controllers");

commentsRouter.delete("/:comment_id", deleteCommentById);
commentsRouter.patch("/:comment_id", patchingCommentById)

module.exports = commentsRouter;
