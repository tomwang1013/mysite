var express = require('express');
var router = express.Router();

// ajax or redirect
router.post('/signup',  gControllers.user.signup);
router.post('/login',   gControllers.user.login);

// render page
router.get('/',         gControllers.home.index);
router.get('/signup',   gControllers.user.signupView);
router.get('/login',    gControllers.user.loginView);
router.get('/logout',   gControllers.user.logout);
router.get('/profile',  gControllers.user.profile);

module.exports = router;
