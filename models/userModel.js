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
    },
});

userSchema.virtual('posts', {
  ref: 'post',
  localField: 'id',
  foreignField: 'userId',
  justOne: false
});

userSchema.virtual('tasks', {
  ref: 'task',
  localField: 'id',
  foreignField: 'userId',
  justOne: false
});

userSchema.virtual('phones', {
  ref: 'phone',
  localField: 'id',
  foreignField: 'userId',
  justOne: false
});

module.exports = mongoose.model('user',userSchema);