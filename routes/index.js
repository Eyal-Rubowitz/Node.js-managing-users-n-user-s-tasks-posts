var express = require('express');
var router = express.Router();
let axios = require('axios');
let userModel = require('../models/userModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/create-db',  async function(req, res, nex) {
    userList = await axios.get('https://jsonplaceholder.typicode.com/users');

  console.log("Foobar!"); 
  console.log(userList.data);  
  userList.data.forEach( user => {
      let u = new userModel(user);
      u.save(function(err, doc){
        if(err) console.log(err);
      });
    });
    res.send("Setup DB Done!"); 
  //})
})

module.exports = router;
