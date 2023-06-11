const { StatusCodes } = require("http-status-codes");
const Child = require("../models/Child");
const Process = require("../models/Process");
const Orphanage = require("../models/Orphanage");
const fastCsv = require("fast-csv");
const moment = require("moment");

/**
 * @returns list of child based on current status
 */
const getAllChild = async (req, res) => {
  const filter_string = req.query.status;
  let allChilds = [];
  if (filter_string === "complete") {
    allChilds = await Child.find({ is_done: true })
      .populate({
        path: "process.process_list._process",
        select: "name",
      })
      .select(
        "_id , gender , name , category , process.process_list.is_completed , is_done , dob"
      );
  } else if (filter_string === "process") {
    allChilds = await Child.find({ is_done: false })
      .populate({
        path: "process.process_list._process",
        select: "name",
      })
      .select(
        "_id , gender , name , category , process.process_list.is_completed , is_done , dob"
      );
  } else {
    allChilds = await Child.find({})
      .populate({
        path: "process.process_list._process",
        select: "name",
      })
      .select(
        "_id , gender , name , category , process.process_list.is_completed , is_done , dob"
      );
  }
  allChilds = allChilds.map((doc) => {
    let nextStep = "-1";
    if (doc.is_done) {
      nextStep = "COMPLETED";
    } else {
      for (let subDoc of doc.process) {
        for (let pp of subDoc.process_list) {
          if (!pp.is_completed) {
            nextStep = pp._process.name;
            break;
          }
        }
        if (nextStep !== "-1") break;
      }
    }

    return {
      next_step: nextStep,
      name: doc.name,
      gender: doc.gender,
      category: doc.category,
      dob: moment().diff(doc.dob, 'years'),
      _id: doc._id,
    };
  });
  return res.status(StatusCodes.OK).send({ data: allChilds });
};

/**
 * @returns list of child assigned to a particular social worker
 */
const getAssignedChild = async (req, res) => {
  const operatorId = req.params.id;
  const filter_string = req.query.status;
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
    })
      .populate({
        path: "process.process_list._process",
        select: "name",
      })
      .select(
        "_id , gender , name , category , process.process_list.is_completed , dob"
      );

    allChilds = allChilds.map((doc) => {
      let nextStep = "COMPLETED";

      for (let subDoc of doc.process) {
        for (let pp of subDoc.process_list) {
          if (!pp.is_completed) {
            nextStep = pp._process.name;
            break;
          }
        }
        if (nextStep) break;
      }
      return {
        next_step: nextStep,
        name: doc.name,
        gender: doc.gender,
        category: doc.category,
        dob: moment().diff(doc.dob, 'years'),
        _id: doc._id,
      };
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
  const childId = req.params.id;
  const reqChild = await Child.findById(childId)
    .populate({ path: "process.process_list._process" })
    .select("process");
  if (!reqChild) {
    return res.status(StatusCodes.NOT_FOUND).send({ msg: "Child not found !" });
  }
  const resp = {
    // category: reqChild.category,
    process: reqChild.process,
    // parent_investigation_completed: reqChild.is_done,
    // is_adopted: reqChild.is_adopted,
    // ffa_document: reqChild.ffa_document,
    // csr_document: reqChild.csr_document,
    // mer_document: reqChild.mer_document,
    // previous_org_document: reqChild.previous_org_document,
    // dcpo_document: reqChild.dcpo_document,
    // caring_document: reqChild.caring_document,
  };
  return res.status(StatusCodes.OK).send({ data: resp });
};

const transformer = (doc) => {
  return {
    Id: doc._id,
    Name: doc.name,
    DOB: doc.dob,
    "Shelter Home": doc.shelter_home,
    Gender: doc.gender,
    Category: doc.category,
    "Admission Reason": doc.admission_reason,
    Guardian: doc.guardian,
    "Last visit": doc.last_visit,
    "Home Stay (month)": doc.home_stay.month,
    "Home Stay (year)": doc.home_stay.year,
    "Case History": doc.case_history,
    "Case completed": doc.is_done,
    "Entry in system": doc.entry_date,
  };
};

const generateChildCSV = async (req, res) => {
  const { filter } = req.query;
  let cursor;
  if (filter === "complete") {
    cursor = Child.find({ is_done: true }).cursor();
  } else if (filter === "process") {
    cursor = Child.find({ is_done: false }).cursor();
  } else {
    cursor = Child.find({}).cursor();
  }

  const filename = "BalAshaExport.csv";

  res.setHeader("Content-disposition", `attachment; filename=${filename}`);
  res.writeHead(200, { "Content-Type": "text/csv" });

  res.flushHeaders();

  const csvStream = fastCsv.format({ headers: true }).transform(transformer);
  cursor.pipe(csvStream).pipe(res);
};

const getCompleteChildDetails = async (req, res) => {
  const childId = req.params.id;
  const reqChild = await Child.findById(childId).populate([
    { path: "process.process_list._process" },
    { path: "orphanage" },
    { path: "operator_assigned", select: "name" },
  ]);
  if (!reqChild) {
    return res.status(StatusCodes.NOT_FOUND).send({ msg: "Child not found !" });
  }
  // get all the files
  const fileLinks = [];
  const details = {};
  reqChild.process.forEach((doc) => {
    const curr = {};
    doc.process_list.forEach((subDoc) => {
      if (subDoc.url)
        fileLinks.push({ name: subDoc._process.name, url: subDoc.url });
      curr[subDoc._process.name] = subDoc.response;
    });
    details[doc.name] = curr;
  });
  
  return res.status(StatusCodes.OK).send({ data: reqChild, links: fileLinks, details });
};

/**
 * @info to register a new child into system
 */
const createChild = async (req, res) => {
  const {
    name,
    dob,
    orphanage_name,
    city,
    state,
    pin,
    orphanage_contact,
    shelter_home,
    gender,
    category,
    admission_reason,
    last_visit,
    guardian,
    home_stay,
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
              Date.now() + policeProcess.default_duration * 24 * 60 * 60 * 1000,
          },
          {
            _process: TVPubProcess,
            end_date:
              Date.now() + policeProcess.default_duration * 24 * 60 * 60 * 1000,
          },
          {
            _process: newspaperPubProcess,
            end_date:
              Date.now() + policeProcess.default_duration * 24 * 60 * 60 * 1000,
          },
          {
            _process: socialProcess,
            end_date:
              Date.now() + policeProcess.default_duration * 24 * 60 * 60 * 1000,
          },
        ],
      },
      {
        name: "Submit to DCPU and get NOC",
        process_list: [
          {
            _process: dcpuProcess,
            end_date:
              Date.now() +
              dcpuProcess.default_duration * 2 * 24 * 60 * 60 * 1000,
          },
        ],
      },
      {
        name: "Submit to CWC and get LFA",
        process_list: [
          {
            _process: cwcProcess,
            end_date:
              Date.now() +
              dcpuProcess.default_duration * 2 * 24 * 60 * 60 * 1000,
          },
        ],
      },
      {
        name: "Get child uploaded to Carings",
        process_list: [
          {
            _process: medicalProcess,
            end_date:
              Date.now() +
              dcpuProcess.default_duration * 2 * 24 * 60 * 60 * 1000,
          },
          {
            _process: caringProcess,
            end_date:
              Date.now() +
              dcpuProcess.default_duration * 2 * 24 * 60 * 60 * 1000,
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

  let reqOrphanage = await Orphanage.findOne({
    name: orphanage_name,
    address: { city, state, pin },
    contact_number: orphanage_contact,
  });

  if (!reqOrphanage) {
    reqOrphanage = new Orphanage({
      name,
      address: { city, state, pin },
      orphanage_contact,
    });
    reqOrphanage = await reqOrphanage.save();
  }

  const newChild = new Child({
    name,
    image_url: req?.file?.path,
    dob,
    shelter_home,
    gender,
    category,
    admission_reason,
    guardian,
    last_visit,
    home_stay,
    case_history,
    operator_assigned,
    process,
    orphanage: reqOrphanage._id,
  });

  await newChild.save();

  res.status(StatusCodes.OK).send({ msg: "Child registered successfully !" });
};

module.exports = {
  getAllChild,
  getAssignedChild,
  getChildDetails,
  createChild,
  getCompleteChildDetails,
  generateChildCSV,
};
