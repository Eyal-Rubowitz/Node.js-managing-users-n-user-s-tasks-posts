// let axios = require('axios');

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var taskSchema = new Schema({
    userId: Number,
    id: Number,
    title: String,
    completed: Boolean
});



module.exports = mongoose.model('task',taskSchema);

// module.exports.getTaskList = function () {
//     let p = axios.get('https://jsonplaceholder.typicode.com/todos');
//     return p;
// }

// module.exports.getTaskById = function (id) {
//     let p = axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
//     return p;
// }