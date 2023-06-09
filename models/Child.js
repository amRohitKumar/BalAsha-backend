const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChildSchema = new Schema({
  name: String,
  image_url: String,
  dob: Date,
  shelter_home: String,
  gender: {
    type: String,
    enum: ["MALE", "FEMALE", "OTHER"],
    required: true,
  },
  category: {
    type: String,
    enum: ["ABANDONED", "ORPHAN", "SURRENDERED"],
    required: true,
  },
  admission_reason: String,
  guardian: String,
  last_visit: String,
  home_stay: {
    year: Number,
    month: {
      type: Number,
      min: 0,
      max: 11,
    },
  },
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
      name: String,
      process_list: [
        {
          _process: {
            type: Schema.Types.ObjectId,
            ref: "Process",
          },
          url: String,
          response: String,
          start_date: {
            type: Date,
            default: Date.now,
          },
          end_date: Date,
          is_completed: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
  is_done: {
    type: Boolean,
    default: false,
  },
  entry_date: {
    type: Date,
    default: Date.now,
  },
});

const Child = mongoose.model("Child", ChildSchema);
module.exports = Child;
