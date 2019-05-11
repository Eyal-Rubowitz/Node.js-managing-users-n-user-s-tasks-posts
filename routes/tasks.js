let express = require('express');
let router = express.Router();
let taskModel = require('../models/taskModel');

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
        // taskModel.findOne({id: req.params.id},                     
        // (err,task) => {            
        //     if(err) return resp.send(err);
        //     task.remove(err => {
        //         if(err) return resp.send(err);
        //         return resp.send('Deleted !');
        //     });
        // });
    });

module.exports = router;

