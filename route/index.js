var express = require('express');
var router = express.Router();
var multer  = require('multer');
var gridfs  = require('../lib/gridfs');

var storage = multer.diskStorage({
  destination: 'public/tmp/uploads',
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
router.post('/signup_step1',          gControllers.user.signup_step1);
router.post('/signup_step2',          gControllers.user.signup_step2);
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
router.get('/login/by/:oauthServer',  gControllers.user.loginByAuth);
router.get('/oauth/:oauthServer/cb',  gControllers.user.oauthCallback);

// users
router.get('/user/:id',                 gControllers.middlewares.checkLogin, gControllers.user.show);
router.get('/users/queryByCompanyName', gControllers.user.queryByCompanyName);

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
router.post('/job/:id/remove',        gControllers.middlewares.checkCompanyLogin, gControllers.jobs.remove);

// questions
router.get('/questions',                      gControllers.questions.search);
router.get('/job/:jid/questions',             gControllers.questions.index);
router.get('/job/:jid/questions/new',         gControllers.middlewares.checkCompanyLogin, gControllers.questions.nnew);
router.post('/job/:jid/questions/create',     gControllers.middlewares.checkCompanyLogin, gControllers.questions.create);
router.get('/job/:jid/question/:qid/edit',    gControllers.middlewares.checkCompanyLogin, gControllers.questions.edit);
router.get('/job/:jid/question/:qid',         gControllers.questions.show);
router.post('/job/:jid/question/:qid/update', gControllers.middlewares.checkCompanyLogin, gControllers.questions.update);
router.post('/question/:qid/remove',          gControllers.middlewares.checkCompanyLogin, gControllers.questions.remove);

// answers
router.get('/question/:qid/answers',                    gControllers.middlewares.checkCompanyLogin, gControllers.answers.index);
router.get('/question/:qid/answers/new',                gControllers.middlewares.checkStudentLogin, gControllers.answers.nnew);
router.post('/question/:qid/answers/create',            gControllers.middlewares.checkStudentLogin, gControllers.answers.create);
router.get('/question/:qid/answer/:aid',                gControllers.middlewares.checkLogin,        gControllers.answers.show);
router.get('/question/:qid/answer/:aid/edit',           gControllers.middlewares.checkStudentLogin, gControllers.answers.edit);
router.post('/question/:qid/answer/:aid/update',        gControllers.middlewares.checkStudentLogin, gControllers.answers.update);
router.post('/question/:qid/answer/:aid/update_score',  gControllers.middlewares.checkCompanyLogin, gControllers.answers.updateScore);
router.post('/question/:qid/answer/:aid/remove',        gControllers.middlewares.checkStudentLogin, gControllers.answers.remove);

// user center
router.get('/profile(/:page_name)?',      gControllers.middlewares.checkLogin, gControllers.profile.index);
router.get('/profile/message_status',     gControllers.profile.messageStatus);
router.post('/profile/change_user_info',  gControllers.middlewares.checkLogin, gControllers.profile.changeUserInfo);
router.post('/profile/change_account',    gControllers.middlewares.checkLogin, gControllers.profile.changeAccount);
router.post('/profile/change_password',   gControllers.middlewares.checkLogin, gControllers.profile.changePassword);
router.post('/profile/change_avatar',     upload.single('avatar'), gControllers.middlewares.checkLogin, gControllers.profile.changeAvatar);
router.post('/profile/change_avatar2',    gControllers.middlewares.checkLogin, gControllers.profile.changeAvatar2);
router.post('/profile/message/set_read',  gControllers.middlewares.checkLogin, gControllers.profile.setMsgRead);

// misc
router.get('/download/:filename',   gControllers.gridfs.download);
router.get('/upload/:filename',     gControllers.gridfs.upload);
router.get('/universities',         gControllers.universities.index);
router.get('/majors',               gControllers.majors.index);

// question labels
router.get('/qlabels/search', gControllers.ques_labels.search);
router.post('/qlabels',       gControllers.ques_labels.create);

// 编辑器操作对应服务端处理
router.use('/ueditor', upload.single('upfile'), gControllers.ueditor.index);

// about
router.get('/about', gControllers.about.index);


module.exports = router;
