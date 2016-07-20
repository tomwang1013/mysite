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
router.post('/jobs/apply',   gControllers.jobs.apply);
router.get('/jobs/:id/edit', gControllers.jobs.edit);
router.post('/jobs/:id',     gControllers.jobs.update);

// user center
router.get('/profile',            gControllers.profile.index);
router.get('/profile/user_info',  gControllers.profile.userInfo);
router.get('/profile/jobs',       gControllers.profile.jobs);
router.post('/profile/change_user_info',       gControllers.profile.changeUserInfo);

module.exports = router;
