const Child = require("../models/Child");

const getSWforMail = async () => {
  const resp = await Child.aggregate([
    { $match: { is_done: false } },
    { $unwind: "$process" },
    { $unwind: "$process.process_list" },
    { $match: { "process.process_list.is_completed": false } },
    {
      $match: {
        $expr: {
          $and: [
            { $gte: ["$process.subprocess.end_date", new Date()] },
            { $lte: ["$process.subprocess.end_date", { $add: [new Date(), 48 * 60 * 60 * 1000] }] }
          ]
        }
      }
    },
    {
      $lookup: {
        from: "processes",
        localField: "process.process_list._process",
        foreignField: "_id",
        as: "task",
      },
    },
    {
      $lookup: {
        from: "operators", // Replace "workers" with your actual worker collection name
        localField: "operator_assigned",
        foreignField: "_id",
        as: "worker",
      },
    },
    {
      $group: {
        _id: "$_id",
        workerEmail: { $first: "$worker.email" },
        workerName: { $first: "$worker.name" },
        firstIncompleteSubtask: { $first: "$task.name" },
      },
    },
    {
      $project: {
        _id: 0,
        firstIncompleteSubtask: 1,
        workerEmail: 1,
        workerName: 1,
      },
    },
  ]);

  return resp;
};

module.exports = getSWforMail;
