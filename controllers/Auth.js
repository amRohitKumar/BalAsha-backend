const { StatusCodes } = require("http-status-codes");
const { hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const Operator = require("../models/Operator");

/**
 * @info operator sinup function
 */
const registerOperator = async (req, res) => {
  const { username, phone_number, address, password, name, role } = req.body;
  const resp = await Operator.find({ $or: [{ username }, { phone_number }] });
  if (resp.length) {
    return res
      .status(StatusCodes.CONFLICT)
      .send({ msg: "Username or phone number already in use !" });
  }
  const newOperator = new Operator({
    username,
    password: hashSync(password, 10),
    name,
    role,
    phone_number,
    address,
  });
  const savedOperator = await newOperator.save();

  const payload = {
    role: savedOperator.role,
    is_verified: savedOperator.is_verified,
    username: savedOperator.username,
    id: savedOperator._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });

  return res.status(StatusCodes.OK).send({
    user: {
      token: "Bearer " + token,
      role: savedOperator.role,
      child_assigned: savedOperator.child_assigned,
      name: savedOperator.name,
      is_verified: savedOperator.is_verified,
      address: savedOperator.address,
      username: savedOperator.username,
      phone_number: savedOperator.phone_number,
      id: savedOperator._id,
    },
  });
};

/**
 * @info operator signin function
 */
const loginOperator = async (req, res) => {
  const { username, password } = req.body;
  const resp = await Operator.findOne({ username });
  if (!resp) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ msg: "Wrong username or password !" });
  }

  if (!compareSync(password, resp.password)) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ msg: "Wrong username or password !" });
  }

  const payload = {
    role: resp.role,
    is_verified: resp.is_verified,
    username: resp.username,
    id: resp._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });

  return res.status(StatusCodes.OK).send({
    user: {
      token: "Bearer " + token,
      role: resp.role,
      child_assigned: resp.child_assigned,
      name: resp.name,
      is_verified: resp.is_verified,
      address: resp.address,
      username: resp.username,
      phone_number: resp.phone_number,
      id: resp._id,
    },
  });
};

module.exports = { registerOperator, loginOperator };
