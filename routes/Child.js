const express = require("express");
const passport = require("passport");
const router = express.Router();

const {
  getAllChild,
  getAssignedChild,
  getChildDetails,
  createChild,
  getCompleteChildDetails,
  generateChildCSV
} = require("../controllers/Child");

router
  .route("/list")
  .get(passport.authenticate("jwt", { session: false }), getAllChild);

router
  .route("/list/:id")
  .get(passport.authenticate("jwt", { session: false }), getAssignedChild);

router
  .route("/add")
  .post(passport.authenticate("jwt", { session: false }), createChild);

router
  .route("/complete/:id")
  .get(passport.authenticate("jwt", { session: false }), getCompleteChildDetails);

router
  .route("/getcsv")
  .get(passport.authenticate("jwt", {session: false}), generateChildCSV);

router
  .route("/:id")
  .get(passport.authenticate("jwt", { session: false }), getChildDetails);

module.exports = router;
