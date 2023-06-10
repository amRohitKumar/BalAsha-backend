const { StatusCodes } = require("http-status-codes");
const Operator = require("../models/Operator");
const Child = require("../models/Child");

/**
 * @returns list of all social worker (for registration page)
 */
const socialWorkerList = async (req, res) => {
  const resp = await Operator.find({ role: "SOCIAL_WORKER" }).select(
    "_id , name , email"
  );
  return res.status(StatusCodes.OK).send({ data: resp });
};

/**
 * @info update response and status of child process (for social worker)
 */
const updateChildField = async (req, res) => {
  const { childId, processId, stepId } = req.params;
  const { response } = req.body;
  console.log(response);
  const reqChild = await Child.findById(childId)
    .populate({ path: "process.process_list._process" })
    .select("process");
  if (!reqChild) {
    return res.send(StatusCodes.NOT_FOUND).send({ msg: "Child not found !" });
  }
  let newDoc = {};
  for (let idx1 = 0; idx1 < reqChild.process.length; idx1++) {
    if (reqChild.process[idx1]._id == processId) {
      for (
        let idx2 = 0;
        idx2 < reqChild.process[idx1].process_list.length;
        idx2++
      ) {
        if (reqChild.process[idx1].process_list[idx2]._id == stepId) {
          reqChild.process[idx1].process_list[idx2].url = req.file.path;
          reqChild.process[idx1].process_list[idx2].response = response;
          reqChild.process[idx1].process_list[idx2].is_completed = true;
          newDoc = await reqChild.save();
          break;
        }
      }
    }
  }
  res.status(StatusCodes.OK).send({ data: newDoc });
};

/**
 * @info update deadline of child process (for manager)
 */
const updateProcessDeadline = async (req, res) => {
  const { childId, processId, stepId } = req.params;
  const { start_date, end_date } = req.body;
  const reqChild = await Child.findById(childId)
    .populate({ path: "process.process_list._process" })
    .select("process");
  if (!reqChild) {
    return res.send(StatusCodes.NOT_FOUND).send({ msg: "Child not found !" });
  }

  let newDoc = {};
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
          newDoc = await reqChild.save();
          break;
        }
      }
    }
  }

  res.status(StatusCodes.OK).send({ data: newDoc });
};

const markDone = async (req, res) => {
  const { childId } = req.params;
  const resp = await Child.findById(childId);
  if (!resp) {
    return res.status(StatusCodes.NOT_FOUND).send({ msg: "Child not found !" });
  }
  resp.is_done = true;
  await resp.save();
  return res
    .status(StatusCodes.OK)
    .send({ msg: "Child marked successfully !" });
};

const getStats = async (req, res) => {
  let completeNumber = await Child.count({});
  const incompleteCase = await Child.find({ is_done: false });
  let incompleteCasesNumber = incompleteCase.length;
  completeNumber = completeNumber - incompleteCasesNumber;
  let grp1 = [0, 0, 0, 0],
    grp2 = [0, 0, 0, 0, 0, 0, 0, 0];
  incompleteCase.forEach((child) => {
    let ptr = 0;
    for (let idx2 = 0; idx2 < child.process.length; idx2++) {
      doc = child.process[idx2];
      let flag = false;
      for (let idx = 0; idx < doc.process_list.length; idx++) {
        if (doc.process_list[idx].is_completed === false) {
          grp2[ptr] += 1;
          grp1[idx2] += 1;
          flag = true;
          break;
        }
        ptr++;
      }
      if (flag) break;
    }
  });
  // console.log(grp1, grp2);
  let name1 = ["DATA COLLECTION", "DCPU", "CWC", "CARINGS"],
    name2 = [
      "Police Report",
      "TV telecasting",
      "Newspaper Publication",
      "Social Report",
      "DCPU",
      "LFA",
      "MEDICAL",
      "CARINGS",
    ];
  grp1 = grp1.map((val, idx) => {
    return { value: val, name: name1[idx] };
  });
  grp2 = grp2.map((val, idx) => {
    return { value: val, name: name2[idx] };
  });

  let categoryStats = await Child.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(StatusCodes.OK).send({
    data1: grp2,
    data2: categoryStats,
    completeNumber,
    incompleteCasesNumber,
  });
};

module.exports = {
  socialWorkerList,
  updateChildField,
  updateProcessDeadline,
  markDone,
  getStats,
};
