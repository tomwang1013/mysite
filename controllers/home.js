function index(req,res, next) {
  if (req.currentUser) {
    if (req.currentUser.type === 0) {
      res.redirect('/jobs');
    } else {
      res.redirect('/profile/jobs');
    }
  } else {
    res.render('home/index');
  }
}

module.exports = {
  index: index
};
