const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const {
  socialWorkerList,
  updateChildField,
  updateProcessDeadline,
  markDone,
  getStats,
  test,
} = require("../controllers/Operator");

router
  .route("/swlist")
  .get(passport.authenticate("jwt", { session: false }), socialWorkerList);

router
  .route("/getstats")
  .get(passport.authenticate("jwt", { session: false }), getStats);

router
  .route("/final/:childId")
  .get(passport.authenticate("jwt", { session: false }), markDone);

router
  .route("/update/:childId/:processId/:stepId")
  .patch(
    passport.authenticate("jwt", { session: false }),
    upload.single("documents"),
    updateChildField
  );


router
  .route("/updatetime/:childId/:processId/:stepId")
  .patch(
    passport.authenticate("jwt", { session: false }),
    updateProcessDeadline
  );

module.exports = router;
