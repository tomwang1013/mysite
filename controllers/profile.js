function index(req, res, next) {
  if (!req.currentUser) {
    res.redirect('/login');
  } else {
    res.redirect(301, '/profile/user_info');
  }
}

function userInfo(req, res, next) {
  if (!req.currentUser) {
    return res.redirect('/login');
  }

  res.render('profile/index', {
    pos: 'user_info',
    user: req.currentUser
  });
}

function jobs(req, res, next) {
  if (!req.currentUser) {
    return res.redirect('/login');
  }

  gModels
    .ApplyJob.find({ _userId: req.currentUser.id })
    .populate('_job')
    .exec(function(err, applyJobs) {
    res.render('profile/index', {
      pos: 'jobs',
      jobs: applyJobs.map(function(a) { return a._job; }),
      user: req.currentUser
    });
  });
}

exports = module.exports = {
  index:    index,
  userInfo: userInfo,
  jobs:     jobs,
};
