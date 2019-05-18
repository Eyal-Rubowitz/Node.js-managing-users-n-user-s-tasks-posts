const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var taskSchema = new Schema({
    userId: Number,
    id: Number,
    title: String,
    completed: Boolean
});

module.exports = mongoose.model('task',taskSchema);