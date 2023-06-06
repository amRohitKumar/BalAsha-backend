const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  socialWorkerList,
  updateChildField,
  updateProcessDeadline,
} = require("../controllers/Operator");

router
  .route("/swlist")
  .get(passport.authenticate("jwt", { session: false }), socialWorkerList);

router
  .route("/update/:childId/:processId/:stepId")
  .patch(passport.authenticate("jwt", { session: false }), updateChildField);

router
  .route("/updatetime/:childId/:processId/:stepId")
  .patch(passport.authenticate("jwt", { session: false }), updateProcessDeadline);

module.exports = router;
