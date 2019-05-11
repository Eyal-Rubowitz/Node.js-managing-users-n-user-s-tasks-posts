const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var phoneSchema = new Schema({
    UserID: Number,
    phoneType: {
        type: String,
        enum: ['landline', 'mobile', 'fax']
    },
    phoneNumber: String
})

module.exports = mongoose.model('phone',phoneSchema);
