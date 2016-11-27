function index(req, res, next) {
  res.render('about/index');
};

function contact(req, res, next) {
  res.render('about/contact');
};

exports = module.exports = { index, contact };
