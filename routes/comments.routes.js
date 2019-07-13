const express = require('express');
const router = express.Router({ mergeParams:true});
const comments = require('../controllers/comments.controller');
const posts = require ('../middlewares/post.mid');

// router.get('/comments', posts.existsPost, comments.list);
router.get('/comments', posts.existsPost, comments.get);
router.post('/comments', posts.existsPost, comments.create);
router.delete('/comments/:id',  posts.existsPost, comments.delete);
router.put('/comments/:id', posts.existsPost, comments.update);

module.exports = router;