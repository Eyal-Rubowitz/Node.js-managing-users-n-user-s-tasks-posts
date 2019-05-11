// let axios = require('axios');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var postSchema = new Schema({
    userId: Number,
    id: Number,
    title: String,
    body: String
});



module.exports = mongoose.model('post',postSchema);



// module.exports.getPostList = function () {
//     let p = axios.get('https://jsonplaceholder.typicode.com/posts');
//     return p;
// }

// module.exports.getPostById = function (id) {
//     let p = axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
//     return p;
// }