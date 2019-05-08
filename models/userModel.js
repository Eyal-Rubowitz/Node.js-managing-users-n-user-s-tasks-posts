// let axios = require('axios');

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema({
    id: Number,
    name: String,
    username: String,
    email: String,
    address: {
      street: String,
      suite: String,
      city: String,
      zipcode: String,
      geo: {
        lat: Number,
        lng: Number
      }
    },
    phone: String,
    website: String,
    company: {
      name: String,
      catchPhrase: String,
      bs: String
    }
});



module.exports = mongoose.model('user',userSchema);


// module.exports.getUserList = function () {
//     let p = axios.get('https://jsonplaceholder.typicode.com/users');
//     return p;
// }

// module.exports.getUserById = function (id) {
//     let p = axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
//     return p;
// }