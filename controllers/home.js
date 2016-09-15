function index(req,res, next) {
  if (req.currentUser) {
    if (req.currentUser.type === 0) {
      res.render('home/index');
    } else {
      res.render('home/index');
    }
  } else {
    res.render('home/index');
  }
}

module.exports = {
  index: index
};
