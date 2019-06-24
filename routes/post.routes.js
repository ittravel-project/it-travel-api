const express = require('express');
const router = express.Router();
const posts = require('../controllers/posts.controller');
const secure = require('../middlewares/secure.mid');

router.get('/', secure.isAunthenticated,posts.list);
router.post('/', secure.isAunthenticated,posts.create);
router.get('/:id', secure.isAunthenticated,posts.get);
router.delete('/:id', secure.isAunthenticated,posts.delete);
router.put('/:id', secure.isAunthenticated,posts.update);

module.exports=router