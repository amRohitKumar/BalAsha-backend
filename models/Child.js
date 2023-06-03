const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChildSchema = new Schema({
  orphanage: {
    type: Schema.Types.ObjectId,
    ref: "Orphanage",
  },
  operator_assigned: {
    type: Schema.Types.ObjectId,
    ref: "Operator",
  },
  process: [
    {
      _process: {
        type: Schema.Types.ObjectId,
        ref: "Process",
      },
      is_completed: {
        type: Bool,
        default: false,
      },
      response: String,
      start_date: Date,
      end_time: Date,
    },
  ],
  documents: [
    {
      url: String,
      name: {
        type: String,
        enum: ["POLICE_REPORT", "HEALTH_DOCUMENT"], // add different types of documents
        required: true,
      },
    },
  ],
  entry_date: {
    type: Date,
    required: true,
  },
});

const Child = mongoose.model("Child", ChildSchema);
module.exports = Child;
