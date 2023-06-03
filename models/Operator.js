const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OperatorSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["SOCIAL_WORKER", "MANAGER", "OPERATIONAL_MANAGER"],
    default: "SOCIAL_WORKER",
    required: true,
  },
  child_assigned: [
    {
      type: Schema.Types.ObjectId,
      ref: "Child",
    },
  ],
});

const Operator = mongoose.model("Operator", OperatorSchema);
module.exports = Operator;
