let express = require('express');
let router = express.Router();
let taskModel = require('../models/taskModel');
let sequenceModel = require('../models/sequenceModel');

router.route('/foo').get((req, resp) => {
 taskModel.findOne().sort('-id').exec((err, obj) => {
    resp.json(obj);
  });   
});


// create
router.route('/').
  post(async function (req, resp) {
    const newTask = new taskModel(req.body);
    newTask.userId = req.userId;
    await sequenceModel.setId(newTask);
    newTask.save(function (err) {
      if (err) resp.send(err);
      resp.redirect('/users');
    });
    sequenceModel.foobar();
  });

router.route('/new').
    get((req, res) => {
        res.render('tasks/new', { user_id: req.userId })
    });

router.route('/:id/edit').
    get((req, res) => {
        taskModel.findOne({ id: req.params.id }, (err, task) => {
            if (err) return res.send(err);
            return res.render('task', { task: task });
        });
    });


router.route('/:id/update').
    post((req, resp) => {
        taskModel.findByIdAndUpdate(req.params.id,
            req.body,
            (err) => {
                if (err) return resp.send(err);
                return resp.send('Updated !');
            });
    });

router.route('/:id/delete').
    post((req, res) => {
        taskModel.findByIdAndRemove(req.params.id, (err, task) => {
            if (err) return res.send(err);
            return res.send('Deleted !');
        });
    });

module.exports = router;

