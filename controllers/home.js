function index(req,res, next) {
  res.locals.title = '学做';
  res.render('home/index');
}

module.exports = {
  index: index
};
