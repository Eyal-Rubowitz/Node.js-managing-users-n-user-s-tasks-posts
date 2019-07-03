const fs = require('fs');
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

// callback after (post) creating data
userSchema.post('save', function (doc) {
  console.log(`in user post hook`);
  fs.writeFile(`./logs/user_${doc.id}`, `${JSON.stringify(doc)}\n`, (err) => {
    if (err) console.log(err);
    console.log(`The user ${doc.id} file has been saved!`);
  })
});

// callback before (pre) updating data
userSchema.pre('findOneAndUpdate', function (next) {
  //console.log('this:',this._update);
  fs.appendFile(`./logs/user_${this._update.id}`, `${JSON.stringify(this._update)}\n`, (err) => {
    if (err) console.log(err);
    console.log(`The user ${this._update.id} file has been saved!`);
  });
  next();
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

module.exports = mongoose.model('user', userSchema);