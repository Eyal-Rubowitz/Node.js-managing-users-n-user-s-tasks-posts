var express = require('express');
var router = express.Router();
let axios = require('axios');
let userModel = require('../models/userModel');
let postModel = require('../models/postModel');
let taskModel = require('../models/taskModel');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/create-db', function (req, res, nex) {
  let tables = [
    ['users', userModel],
    ['posts', postModel],
    ['todos', taskModel]
  ].map( async ([dbTable, tableModel]) => {
    instanceList = await axios.get(`https://jsonplaceholder.typicode.com/${dbTable}`)
    instanceList.data.forEach(instance => {
      let t = new tableModel(instance);
      t.save(function (err, doc) {
        if (err) console.log(err);
      });
    })
  })
  Promise.all(tables).then(() => res.send("Setup DB Done!") );
  
})

module.exports = router;
