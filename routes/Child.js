const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  getAllChild,
  getAssignedChild,
  getChildDetails,
  createChild
} = require("../controllers/Child");

router
  .route("/list")
  .get(passport.authenticate("jwt", { session: false }), getAllChild);

router
  .route("/list/:id")
  .get(passport.authenticate("jwt", { session: false }), getAssignedChild);

router
  .route("/add")
  .post(passport.authenticate("jwt", {session: false}), createChild)

router
  .route("/:id")
  .get(passport.authenticate("jwt", { session: false }), getChildDetails);

module.exports = router;
