const express = require("express");
const router = express.Router();

const {registerOperator, loginOperator} = require("../controllers/Auth");

router.route("/register").post(registerOperator);

router.route("/login").post(loginOperator);

// router.route("/updateUser").patch(updateUser);

module.exports = router;
