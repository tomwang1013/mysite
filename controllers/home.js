function index(req,res, next) {
  res.render('home/index');
}

module.exports = {
  index: index
};
