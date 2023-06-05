const { StatusCodes } = require("http-status-codes");
const Child = require("../models/Child");

const getAllChild = async (req, res) => {
  const filter_string = req.query.status | "";
  let allChilds = [];
  if (filter_string === "complete") {
    allChilds = await Child.find({ is_done: true });
  } else if (filter_string === "process") {
    allChilds = await Child.find({ is_done: false });
  } else {
    allChilds = await Child.find({});
  }
  return res.status(StatusCodes.OK).send({ list: allChilds });
};

const getAssignedChild = async (req, res) => {
  const operatorId = req.params.id;
  const filter_string = req.query.status | "";
  let allChilds = [];
  if (filter_string === "complete") {
    allChilds = await Child.find({ is_done: true, operator_assigned: operatorId });
  } else if (filter_string === "process") {
    allChilds = await Child.find({ is_done: false, operator_assigned: operatorId });
  } else {
    allChilds = await Child.find({operator_assigned: operatorId});
  }
  return res.status(StatusCodes.OK).send({ list: allChilds });
}

module.exports = { getAllChild, getAssignedChild };
