const express = require("express");
const passport = require("passport");
const router = express.Router();

const {getAllChild, getAssignedChild} = require("../controllers/Child");

router
  .route("/list")
  .get(passport.authenticate("jwt", {session: false}), getAllChild)

router
  .route("/list/:id")
  .get(passport.authenticate("jwt", {session: false}), getAssignedChild)

module.exports = router;
