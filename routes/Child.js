const express = require("express");
const router = express.Router();

const {getAllChild, getAssignedChild} = require("../controllers/Child");

router
  .route("/list")
  .get(getAllChild)

router
  .route("/list/:id")
  .get(getAssignedChild)

module.exports = router;
