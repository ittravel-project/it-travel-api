const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const secure = require('../middlewares/secure.mid');
const passport = require('passport');
const uploader = require('../configs/storage.config');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/logout', auth.logout);

router.get('/profile', secure.isAuthenticated, auth.getProfile);
router.get('/profilelist', secure.isAuthenticated, auth.getUserList);
router.put('/profile', secure.isAuthenticated, uploader.single('avatar'), auth.editProfile);

router.get('/authenticate/google', passport.authenticate('google-auth', { scope: ['openid', 'profile', 'email'] }))
router.get('/authenticate/:idp/callback', auth.loginWithIDPCallback)


module.exports = router