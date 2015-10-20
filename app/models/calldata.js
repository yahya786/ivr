// app/models/calldata.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CallDataSchema   = new Schema({
    name: String,
    uuid: String,
    phone: String
});

module.exports = mongoose.model('CallData', CallDataSchema);