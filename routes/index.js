var express = require('express');
var router = express.Router();
let axios = require('axios');
let userModel = require('../models/userModel');
let postModel = require('../models/postModel');
let taskModel = require('../models/taskModel');
let sequenceModel = require('../models/sequenceModel');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/create-db', function (req, res, nex) {
  let collections = [
    // [collection, model]
    ['users', userModel],
    ['posts', postModel],
    ['todos', taskModel]
  ].map(async ([dbTable, collectionModel]) => {
    // estimatedDocumentCount() - how mouch documents per collection
    collectionModel.estimatedDocumentCount().then(async (count) => {
      if (count === 0) {
        let instanceList = await axios.get(`https://jsonplaceholder.typicode.com/${dbTable}`);
        let saves = instanceList.data.map(instance => {
          let c = new collectionModel(instance);
          return c.save();
        });
        Promise.all(saves).then(() => {
          collectionModel.findOne().sort('-id').exec((err, obj) => {
            let seq = new sequenceModel({
              value: obj.id + 1,
              key: `${collectionModel.modelName}_id`
            });
            seq.save();
          });
        });
      }
    });
  });
  Promise.all(collections).then(() => res.send("Setup DB Done!"));

});

module.exports = router;
