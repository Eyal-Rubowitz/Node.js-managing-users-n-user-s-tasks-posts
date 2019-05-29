let express = require('express');
let router = express.Router();

let userModel = require('../models/userModel');
let phoneModel = require('../models/phoneModel');
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
    res.render('users/index', { userList: users });
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
      if (err) resp.send(err);
      resp.redirect('/users');
    });
  });

router.get('/:id', function (req, res, next) {
  userModel.findOne({ id: req.params.id }).exec((err, user) => {
    res.render('users/edit', { user: user });
  });
});

// delete
router.route('/:id/delete').
  post((req, res) => {
    userModel.findByIdAndRemove(req.params.id, (err, user) => {
      if (err) return res.send(err);
      return res.send('Deleted !');
    });
  });

//update
router.route('/:id/update').
  post((req, resp) => {
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
// router.route('/').
//     get(function(req,resp)
//     {
//         peronsDB.find({}, function(err,pers)
//         {
//             console.log(pers);
//             if(err)
//             {
//                 return resp.send(err);
//             }
//             return resp.json(pers);
//         });
//     });

// router.route('/:id').
//     get(function(req,resp)
//     {
//         peronsDB.findById(req.params.id , function(err,per)
//         {            
//             if(err)
//             {
//                 return resp.send(err);
//             }
//             return resp.json(per);
//         });
//     });

// router.route('/:id').
//     put(function(req,resp)
//     {
//         peronsDB.findByIdAndUpdate(req.params.id ,
//                 {
//                     FirstName : req.body.fname,
//                     LastName : req.body.lname
//                 } ,               
//         function(err,per)
//         {            
//             if(err)
//             {
//                 return resp.send(err);
//             }
//             return resp.send('Updated !');
//         });
//     });


// router.route('/:id').
//     delete(function(req,resp)
//     {
//         peronsDB.findByIdAndDelete(req.params.id ,                     
//         function(err,per)
//         {            
//             if(err)
//             {
//                 return resp.send(err);
//             }
//             return resp.send('Deleted !');
//         });
//     });


module.exports = router;
