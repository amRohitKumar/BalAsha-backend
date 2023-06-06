const { StatusCodes } = require("http-status-codes");
const Operator = require("../models/Operator");
const Child = require("../models/Child");

/**
 * @returns list of all social worker (for registration page)
 */
const socialWorkerList = async (req, res) => {
  const resp = await Operator.find({ role: "SOCIAL_WORKER" }).select(
    "_id, username, name"
  );
  return res.status(StatusCodes.OK).send({ data: resp });
};

/**
 * @info update response and status of child process (for social worker)
 */
const updateChildField = async (req, res) => {
  const { childId, processId, stepId } = req.params;
  const { url, response } = req.body;
  const reqChild = await Child.findById(childId);
  if (!reqChild) {
    return res.send(StatusCodes.NOT_FOUND).send({ msg: "Child not found !" });
  }

  for (let idx1 = 0; idx1 < reqChild.process.length; idx1++) {
    if (reqChild.process[idx1]._id == processId) {
      for (
        let idx2 = 0;
        idx2 < reqChild.process[idx1].process_list.length;
        idx2++
      ) {
        if (reqChild.process[idx1].process_list[idx2]._id == stepId) {
          reqChild.process[idx1].process_list[idx2].url = url;
          reqChild.process[idx1].process_list[idx2].response = response;
          reqChild.process[idx1].process_list[idx2].is_completed = true;
          await reqChild.save();
          break;
        }
      }
    }
  }

  res.status(StatusCodes.OK).send({ msg: "Updated successfully !" });
};

/**
 * @info update deadline of child process (for manager)
 */
const updateProcessDeadline = async (req, res) => {
  const { childId, processId, stepId } = req.params;
  const { start_date, end_date } = req.body;
  const reqChild = await Child.findById(childId);
  if (!reqChild) {
    return res.send(StatusCodes.NOT_FOUND).send({ msg: "Child not found !" });
  }

  for (let idx1 = 0; idx1 < reqChild.process.length; idx1++) {
    if (reqChild.process[idx1]._id == processId) {
      for (
        let idx2 = 0;
        idx2 < reqChild.process[idx1].process_list.length;
        idx2++
      ) {
        if (reqChild.process[idx1].process_list[idx2]._id == stepId) {
          reqChild.process[idx1].process_list[idx2].start_date = start_date;
          reqChild.process[idx1].process_list[idx2].end_date = end_date;
          await reqChild.save();
          break;
        }
      }
    }
  }

  res.status(StatusCodes.OK).send({ msg: "Updated successfully !" });
};

module.exports = { socialWorkerList, updateChildField, updateProcessDeadline };
