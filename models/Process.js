const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProcessSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    default_duration: {
        type: Number,
        default: 30,
    },
});

const Process = mongoose.model('Process', ProcessSchema);
module.exports = Process;