let express = require('express');
let router = express.Router();
let taskModel = require('../models/taskModel');
let sequenceModel = require('../models/sequenceModel');
let fs = require('fs');

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
    });

router.route('/new').
    get((req, res) => {
        res.render('tasks/new', { user_id: req.userId })
    });

router.route('/:id/edit')
    .get((req, res) => {
        taskModel.findOne({ id: req.params.id }, (err, task) => {
            if (err) return res.send(err);
            return res.render('tasks/edit', { task: task });
        });
    });

router.route('/:id/update').
    post((req, resp) => {
        taskModel.findByIdAndUpdate(req.params.id,
            req.body,
            (err) => {
                if (err) return resp.send(err);
                fs.appendFile(`./logs/user_${req.body.userId}`, `updated task: ${JSON.stringify(req.body)}  !\n`, (err) => {
                    if (err) console.log(err);
                });
                return resp.send('Updated !');
            });
    });

router.route('/:id/delete').
    post((req, res) => {
        taskModel.findByIdAndRemove(req.params.id, (err) => {
            if (err) return res.send(err);
            fs.appendFile(`./logs/user_${req.body.userId}`, `task ${req.params.id} deleted !\n`, (err) => {
                if (err) console.log(err);
            });
            return res.send('Deleted !');
        });
    });

module.exports = router;

