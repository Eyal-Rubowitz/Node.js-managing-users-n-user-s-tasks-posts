let express = require('express');
let router = express.Router();
let postModel = require('../models/postModel');
let sequenceModel = require('../models/sequenceModel');
let fs = require('fs');

// create
router.route('/')
    .post(async function (req, resp) {
        const newPost = new postModel(req.body);
        newPost.userId = req.userId;
        await sequenceModel.setId(newPost);
        newPost.save(function (err) {
            if (err) resp.send(err);
            resp.redirect('/users');
        });
    });

router.route('/new')
    .get((req, res) => {
        res.render('posts/new', { user_id: req.userId })
    });

router.route('/:id/edit')
    .get((req, res) => {
        postModel.findOne({ id: req.params.id }, (err, post) => {
            if (err) return res.send(err);
            return res.render('posts/edit', { post: post });
        });
    });

router.route('/:id/update')
    .post((req, resp) => {
        postModel.findByIdAndUpdate(req.params.id,
            req.body,
            (err) => {
                if (err) return resp.send(err);
                fs.appendFile(`./logs/user_${req.body.userId}`, `updated post: ${JSON.stringify(req.body)}  !\n`, (err) => {
                    if (err) console.log(err);
                });
                return resp.send('Updated !');
            });
    });

router.route('/:id/delete')
    .post((req, res) => {
        postModel.findByIdAndRemove(req.params.id, (err) => {
            if (err) return res.send(err);
            fs.appendFile(`./logs/user_${req.body.userId}`, `post ${req.params.id} deleted !\n`, (err) => {
                if (err) console.log(err);
            });
            return res.send('Deleted !');
        });
    });

module.exports = router;

