var express = require('express');
var router = express.Router();

// home page
router.get('/',         gControllers.home.index);

// login/signup/logout
router.post('/signup',  gControllers.user.signup);
router.post('/login',   gControllers.user.login);
router.get('/signup',   gControllers.user.signupView);
router.get('/login',    gControllers.user.loginView);
router.get('/logout',   gControllers.user.logout);

// jobs
router.get('/jobs',          gControllers.jobs.index);
router.get('/jobs/new',      gControllers.jobs.newJob);
router.post('/jobs',         gControllers.jobs.create);
router.get('/jobs/:id/edit', gControllers.jobs.edit);
router.post('/jobs/:id',     gControllers.jobs.update);

// user center
router.get('/profile',  gControllers.user.profile);

module.exports = router;
