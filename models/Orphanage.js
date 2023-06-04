const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrphanageSchema = new Schema({
    name: String,
    address: {
        city: String,
        state: String,
        pin: String,
    },
    contact_number: String,
});

const Orphanage = mongoose.model('Orphanage', OrphanageSchema);
module.exports = Orphanage;