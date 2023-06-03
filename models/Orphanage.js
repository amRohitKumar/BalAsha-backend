const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrphanageSchema = new Schema({
    address: String,
    contact_number: String,
});

const Orphanage = mongoose.model('Orphanage', OrphanageSchema);
module.exports = Orphanage;