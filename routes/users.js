let express = require('express');
let router = express.Router();
let fs = require('fs');

let userModel = require('../models/userModel');
let phoneModel = require('../models/phoneModel');
let taskModel = require('../models/taskModel');
let postModel = require('../models/postModel');
let sequenceModel = require('../models/sequenceModel');

let tasksRouter = require('./tasks');
let postsRouter = require('./posts');

router.use('/:id/tasks', (req, res, next) => {
  req.userId = req.params.id;
  next();
}, tasksRouter);

router.use('/:id/posts', (req, res, next) => {
  req.userId = req.params.id;
  next();
}, postsRouter);

// list
router.get('/', function (req, res, next) {
  // populate('relation-name') - reference to matched collection by virtual relations
  userModel.find().populate('posts').populate('tasks').populate('phones').exec((err, users) => {
    if (err) console.log(err);
    // query user by name
    let nameInput = req.query.name;
    console.log(nameInput);
    if (nameInput) {
      nameInput = nameInput.toLowerCase();
      users = users.filter(user => {
        let un = user.name.toLowerCase();
        return un.includes(nameInput);
      });
    }
    res.render('users/index', { userList: users, filtered: !!nameInput });
  });
});

// new
router.get('/new', function (req, res, next) {
  res.render('users/new', { user: new userModel() })
});

// create
router.route('/').
  post(async function (req, resp) {
    const newUser = new userModel(req.body.user);
    await sequenceModel.setId(newUser);
    newUser.save(function (err) {
      if (err) {
        console.log(err);
        return resp.send(err);
      }
      resp.redirect('/users');
    });
  });

router.get('/:id', function (req, res, next) {
  userModel.findOne({ id: req.params.id }).exec((err, user) => {
    res.render('users/edit', { user: user });
  });
});

// delete
router.post('/:id/delete', (req, res) => {
  userModel.findByIdAndRemove(req.params.id, (err) => {
    if (err) return res.send(err);
    fs.appendFile(`./logs/user_${req.body.id}`, `R.I.P.`, (err) => {
      if (err) console.log(err);
    });
    [taskModel, postModel, phoneModel].forEach((model) => {
      model.deleteMany({ userId: req.body.id }, (err) => { if (err) console.log(err) });
    });
    return res.send('Deleted !');
  });
});

//update
router.route('/:id/update').post(
  (req, resp) => {
    let promises = [];

    promises.push(
      userModel.findByIdAndUpdate(req.params.id, req.body.user)
    );

    let phone = req.body.phone
    if (phone.phoneNumber != '') {
      const newPhoneNum = new phoneModel(phone);
      promises.push(newPhoneNum.save());
    }

    Promise.all(promises)
      .catch((err) => {
        console.log(err);
        return resp.send(err);
      }).then(() => {
        return resp.send('Updated !')
      });
  });

module.exports = router;
