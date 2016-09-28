var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'public/uploads/' })

// home page
router.get('/', gControllers.home.index);

// login/signup/logout
router.post('/signup',                gControllers.user.signup);
router.post('/login',                 gControllers.user.login);
router.get('/signup',                 gControllers.user.signupView);
router.get('/login',                  gControllers.user.loginView);
router.get('/logout',                 gControllers.user.logout);
router.get('/signup/is_valid_name',   gControllers.user.isValidName);
router.get('/signup/is_valid_email',  gControllers.user.isValidEmail);
router.get('/password_reset',         gControllers.user.passwordReset);
router.post('/password_reset',        gControllers.user.passwordReset);
router.get('/password_reset/:token',  gControllers.user.passwordReset);
router.post('/password_reset/:token', gControllers.user.passwordReset);

// jobs
router.get('/jobs',                   gControllers.jobs.index);
router.get('/jobs/new',               gControllers.middlewares.checkCompanyLogin, gControllers.jobs.newJob);
router.post('/jobs',                  gControllers.middlewares.checkCompanyLogin, gControllers.jobs.create);
router.post('/jobs/apply',            gControllers.middlewares.checkStudentLogin, gControllers.jobs.apply);
router.get('/job/:id/edit',           gControllers.middlewares.checkCompanyLogin, gControllers.jobs.edit);
router.get('/job/:id/appliers',       gControllers.middlewares.checkCompanyLogin, gControllers.jobs.appliers);
router.get('/job/:id',                gControllers.jobs.show);
router.post('/job/:id',               gControllers.middlewares.checkCompanyLogin, gControllers.jobs.update);
router.post('/job/:id/handle_apply',  gControllers.middlewares.checkCompanyLogin, gControllers.jobs.handleApply);

// user center
router.get('/profile',                    gControllers.middlewares.checkLogin, gControllers.profile.index);
router.get('/profile/account',            gControllers.middlewares.checkLogin, gControllers.profile.account);
router.get('/profile/user_info',          gControllers.middlewares.checkLogin, gControllers.profile.userInfo);
router.get('/profile/jobs',               gControllers.middlewares.checkLogin, gControllers.profile.jobs);
router.post('/profile/change_user_info',  gControllers.middlewares.checkLogin, gControllers.profile.changeUserInfo);
router.post('/profile/change_account',    gControllers.middlewares.checkLogin, gControllers.profile.changeAccount);
router.post('/profile/change_password',   gControllers.middlewares.checkLogin, gControllers.profile.changePassword);
router.post('/profile/change_avatar',     upload.single('avatar'), gControllers.middlewares.checkLogin, gControllers.profile.changeAvatar);

router.get('/uploads/:filename', gControllers.uploads.index );

module.exports = router;
