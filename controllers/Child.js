const { StatusCodes } = require("http-status-codes");
const Child = require("../models/Child");
const Process = require("../models/Process");

/**
 * @returns list of child based on current status
 */
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
  return res.status(StatusCodes.OK).send({ data: allChilds });
};

/**
 * @returns list of child assigned to a particular social worker
 */
const getAssignedChild = async (req, res) => {
  const operatorId = req.params.id;
  const filter_string = req.query.status | "";
  let allChilds = [];
  if (filter_string === "complete") {
    allChilds = await Child.find({
      is_done: true,
      operator_assigned: operatorId,
    });
  } else if (filter_string === "process") {
    allChilds = await Child.find({
      is_done: false,
      operator_assigned: operatorId,
    });
  } else {
    allChilds = await Child.find({ operator_assigned: operatorId });
  }
  return res.status(StatusCodes.OK).send({ data: allChilds });
};

/**
 * @returns info about a particular child
 */
const getChildDetails = async (req, res) => {
  const childId = req.query.id;
  const reqChild = await Child.findById(childId);
  if (!reqChild) {
    return res.status(StatusCodes.NOT_FOUND).send({ msg: "Child not found !" });
  }
  const resp = {
    category: reqChild.category,
    process: reqChild.process,
    parent_investigation_completed: reqChild.is_done,
    is_adopted: reqChild.is_adopted,
    ffa_document: reqChild.ffa_document,
    csr_document: reqChild.csr_document,
    mer_document: reqChild.mer_document,
    previous_org_document: reqChild.previous_org_document,
    dcpo_document: reqChild.dcpo_document,
    caring_document: reqChild.caring_document,
  };
  return req.send(StatusCodes.OK).send({ data: resp });
};

/**
 * @info to register a new child into system
 */
const createChild = async (req, res) => {
  const {
    name,
    image_url,
    dob,
    place,
    shelter_home,
    gender,
    category,
    admission_reason,
    last_visit,
    guardian,
    year,
    month,
    case_history,
    operator_assigned,
  } = req.body;

  let process = [];

  const caringProcess = await Process.findOne({ name: "CARINGS_REPORT" });
  const cwcProcess = await Process.findOne({ name: "LFA_REPORT" });
  const dcpuProcess = await Process.findOne({ name: "DCPU_REPORT" });
  const medicalProcess = await Process.findOne({ name: "MEDICAL_REPORT" });

  if (category === "ABANDONED") {
    const policeProcess = await Process.findOne({ name: "POLICE_REPORT" });
    const TVPubProcess = await Process.findOne({ name: "TV_TELECASTING" });
    const socialProcess = await Process.findOne({ name: "SOCIAL_REPORT" });
    const newspaperPubProcess = await Process.findOne({
      name: "NEWSPAPER_PUBLICATION",
    });
    process = [
      {
        name: "DATA COLLECTION",
        process_list: [
          {
            _process: policeProcess,
            end_date:
              Date.now() + policeProcess.default_duration * 24 * 60 * 60,
          },
          {
            _process: TVPubProcess,
            end_date:
              Date.now() + policeProcess.default_duration * 24 * 60 * 60,
          },
          {
            _process: newspaperPubProcess,
            end_date:
              Date.now() + policeProcess.default_duration * 24 * 60 * 60,
          },
          {
            _process: socialProcess,
            end_date:
              Date.now() + policeProcess.default_duration * 24 * 60 * 60,
          },
        ],
      },
      {
        name: "Submit to DCPU and get NOC",
        process_list: [
          {
            _process: dcpuProcess,
            end_date:
              Date.now() + dcpuProcess.default_duration * 2 * 24 * 60 * 60,
          },
        ],
      },
      {
        name: "Submit to CWC and get LFA",
        process_list: [
          {
            _process: cwcProcess,
            end_date:
              Date.now() + dcpuProcess.default_duration * 2 * 24 * 60 * 60,
          },
        ],
      },
      {
        name: "Get child uploaded to Carings",
        process_list: [
          {
            _process: medicalProcess,
            end_date:
              Date.now() + dcpuProcess.default_duration * 2 * 24 * 60 * 60,
          },
          {
            _process: caringProcess,
            end_date:
              Date.now() + dcpuProcess.default_duration * 2 * 24 * 60 * 60,
          },
        ],
      },
    ];
  } else {
    process = [
      {
        name: "Submit to DCPU and get NOC",
        process_list: [
          {
            _process: dcpuProcess,
            end_date:
              Date.now() + dcpuProcess.default_duration * 2 * 24 * 60 * 60,
          },
        ],
      },
      {
        name: "Submit to CWC and get LFA",
        process_list: [
          {
            _process: cwcProcess,
            end_date:
              Date.now() + dcpuProcess.default_duration * 2 * 24 * 60 * 60,
          },
        ],
      },
      {
        name: "Get child uploaded to Carings",
        process_list: [
          {
            _process: medicalProcess,
            end_date:
              Date.now() + dcpuProcess.default_duration * 2 * 24 * 60 * 60,
          },
          {
            _process: caringProcess,
            end_date:
              Date.now() + dcpuProcess.default_duration * 2 * 24 * 60 * 60,
          },
        ],
      },
    ];
  }

  const newChild = new Child({
    name,
    image_url,
    dob,
    shelter_home,
    gender,
    category,
    admission_reason,
    guardian,
    last_visit,
    home_stay: { year, month },
    case_history,
    operator_assigned,
    process,
  });

  await newChild.save();

  res.status(StatusCodes.OK).send({ msg: "Child registered successfully !" });
};

module.exports = {
  getAllChild,
  getAssignedChild,
  getChildDetails,
  createChild,
};
