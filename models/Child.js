const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChildSchema = new Schema({
  name: String,
  dob: Date,
  state: String,
  district: String,
  shelter_home: String,
  case_number: {
    type: String,
    unique: true,
    required: true,
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE'],
    required: true,
  },
  category: {
    type: String,
    enum: ['ABANDONED', 'ORPHAN', 'SURRENDERED'],
    required: true,
  },
  admission_reason: String,
  flagging_reason: String,
  guardian: String,
  home_stay: {
    year: Number,
    month: {
      type: Number,
      min: 0,
      max: 11
    }
  },
  cwc_last_review: Date,
  case_history: String,
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
        type: Boolean,
        default: false,
      },
      url: String,
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
