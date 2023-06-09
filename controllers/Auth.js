const { StatusCodes } = require("http-status-codes");
const { hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const Operator = require("../models/Operator");

/**
 * @info operator sinup function
 */
const registerOperator = async (req, res) => {
  const { email, phone_number, address, password, name, role } = req.body;
  const resp = await Operator.find({ $or: [{ email }, { phone_number }] });
  if (resp.length) {
    return res
      .status(StatusCodes.CONFLICT)
      .send({ msg: "Email or phone number already in use !" });
  }
  const newOperator = new Operator({
    email,
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
    email: savedOperator.email,
    id: savedOperator._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });

  return res.status(StatusCodes.OK).send({
    user: {
      token: token,
      role: savedOperator.role,
      name: savedOperator.name,
      is_verified: savedOperator.is_verified,
      email: savedOperator.email,
      id: savedOperator._id,
    },
  });
};

/**
 * @info operator signin function
 */
const loginOperator = async (req, res) => {
  const { email, password } = req.body;
  const resp = await Operator.findOne({ email });
  if (!resp) {
    return res
    .status(StatusCodes.UNAUTHORIZED)
    .send({ msg: "Wrong email or password !" });
  }
  
  if (!compareSync(password, resp.password)) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ msg: "Wrong email or password !" });
  }

  const payload = {
    role: resp.role,
    is_verified: resp.is_verified,
    email: resp.email,
    id: resp._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });

  return res.status(StatusCodes.OK).send({
    user: {
      token: token,
      role: resp.role,
      child_assigned: resp.child_assigned,
      name: resp.name,
      is_verified: resp.is_verified,
      address: resp.address,
      email: resp.email,
      phone_number: resp.phone_number,
      id: resp._id,
    },
  });
};

module.exports = { registerOperator, loginOperator };
