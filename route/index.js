var express = require('express');
var router = express.Router();
var multer  = require('multer')
var gridfs  = require('../lib/gridfs');

var storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: function (req, file, cb) {
    cb(null, gridfs.addSuffix2Img(file.originalname, Date.now()));
  }
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }
});

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

// questions
router.get('/job/:jid/questions',             gControllers.middlewares.checkCompanyLogin, gControllers.questions.index);
router.get('/job/:jid/questions/new',         gControllers.middlewares.checkCompanyLogin, gControllers.questions.nnew);
router.post('/job/:jid/questions/create',     gControllers.middlewares.checkCompanyLogin, gControllers.questions.create);
router.get('/job/:jid/question/:qid/edit',    gControllers.middlewares.checkCompanyLogin, gControllers.questions.edit);
router.post('/job/:jid/question/:qid/update', gControllers.middlewares.checkCompanyLogin, gControllers.questions.update);

// user center
router.get('/profile',                    gControllers.middlewares.checkLogin, gControllers.profile.index);
router.get('/profile/account',            gControllers.middlewares.checkLogin, gControllers.profile.account);
router.get('/profile/user_info',          gControllers.middlewares.checkLogin, gControllers.profile.userInfo);
router.get('/profile/jobs',               gControllers.middlewares.checkLogin, gControllers.profile.jobs);
router.post('/profile/change_user_info',  gControllers.middlewares.checkLogin, gControllers.profile.changeUserInfo);
router.post('/profile/change_account',    gControllers.middlewares.checkLogin, gControllers.profile.changeAccount);
router.post('/profile/change_password',   gControllers.middlewares.checkLogin, gControllers.profile.changePassword);
router.post('/profile/change_avatar',     upload.single('avatar'), gControllers.middlewares.checkLogin, gControllers.profile.changeAvatar);
router.post('/profile/change_avatar2',    gControllers.middlewares.checkLogin, gControllers.profile.changeAvatar2);

router.get('/uploads/:filename', gControllers.uploads.index );

module.exports = router;
