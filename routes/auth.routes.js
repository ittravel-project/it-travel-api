const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const secure = require('../middlewares/secure.mid');
const uploader = require('../configs/storage.config');

router.post('/register', auth.register);
router.post('/autenthicate', auth.authenticate);
router.get('/logout', auth.register);


module.exports = router