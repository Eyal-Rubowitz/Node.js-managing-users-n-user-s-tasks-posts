var express = require('express');
var router = express.Router();
var userModel = require('../models/userModel');
var postModel = require('../models/postModel');
var taskModel = require('../models/taskModel');

// const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// mongoose.createConnection('mongodb://localhost/userDB')

router.get('/', function(req, res, next) {
  userModel.getUserList().then( serviceUserData => {
    postModel.getPostList().then( servicePostData => {
      taskModel.getTaskList().then( serviceTaskData => {

        
        res.render('users', {userList: serviceUserData.data, 
                             postList: servicePostData.data,
                             taskList: serviceTaskData.data})
      })})})
});

router.get('/foos', function(req, res, next) {
  userModel.findOne().populate('posts').exec((err, user) => {
    res.send(JSON.stringify(user.posts))
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



// router.route('/').
//     post(function(req,resp)
//     {
//         const newPerson = new peronsDB({
//             FirstName : req.body.fname,
//             LastName : req.body.lname,
//             Age : req.body.age
//         });

//         newPerson.save(function(err)
//         {
//             if(err)
//             {
//                 resp.send(err);                
//             }
//             resp.send('Person Created !')
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
