const express = require('express');
const router = express.Router();
const posts = require('../controllers/posts.controller');
const secure = require('../middlewares/secure.mid');

router.get('/', secure.isAuthenticated, posts.list);
router.post('/', secure.isAuthenticated, posts.create);
router.get('/:id', secure.isAuthenticated, posts.get);
router.delete('/:id', secure.isAuthenticated, posts.delete);
router.put('/:id', secure.isAuthenticated, posts.update);

module.exports=router