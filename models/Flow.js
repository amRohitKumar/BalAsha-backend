const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FlowSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  process_list: [
    {
      type: Schema.Types.ObjectId,
      ref: "Process",
    },
  ],
});

const Process = mongoose.model("Flow", FlowSchema);
module.exports = Process;
