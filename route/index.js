var express = require('express');
var router = express.Router();

// ajax or redirect
router.get('/signup', gControllers.user.signupView);
router.post('/signup', gControllers.user.signup);
router.get('/login',  gControllers.user.loginView);
router.post('/login',  gControllers.user.login);
router.post('/logout', gControllers.user.logout);

// render page
router.get('/', gControllers.home.index);

module.exports = router;
