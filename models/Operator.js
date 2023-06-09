const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OperatorSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone_number: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  is_verified: {
    type: Boolean,
    default: false,
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
    enum: ["SOCIAL_WORKER", "MANAGER", "OPERATIONAL_MANAGER", "ADMIN"],
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
