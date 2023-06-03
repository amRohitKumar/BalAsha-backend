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
    sub_steps: [{
        name: String,
        description: String,
        cateogry: {
            type: String,
            enum: ['FILE', 'INPUT', 'CHECKBOX'],
            default: 'CHECKBOX',
        }
    }],
    default_duration: {
        type: Number,
        default: 30,
    },
});

const Process = mongoose.model('Process', ProcessSchema);
module.exports = Process;