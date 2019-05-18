var express = require('express');
var router = express.Router();
let axios = require('axios');
let userModel = require('../models/userModel');
let postModel = require('../models/postModel');
let taskModel = require('../models/taskModel');
let sequenceModel = require('../models/sequenceModel');

const mongoose = require("mongoose");
const sequence = require('mongoose-sequence')(mongoose);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/create-db', function (req, res, nex) {
  let tables = [
    ['users', userModel],
    ['posts', postModel],
    ['todos', taskModel]
  ].map(async ([dbTable, tableModel]) => {
    tableModel.estimatedDocumentCount().then(async (count) => {
      if (count === 0) {
        instanceList = await axios.get(`https://jsonplaceholder.typicode.com/${dbTable}`)
        let saves = instanceList.data.map(instance => {
          let t = new tableModel(instance);
          return t.save();
        });
        Promise.all(saves).then(() => {
          tableModel.findOne().sort('-id').exec((err, obj) => {
            let seq = new sequenceModel({
              value: obj.id + 1, 
              key: `${tableModel.modelName}_id`
            });
            seq.save();
          });
        });
      }
    })
  })
  Promise.all(tables).then(() => res.send("Setup DB Done!"));

})

module.exports = router;
