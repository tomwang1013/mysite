function index(req, res, next) {
  res.render('about/index');
};

function fmValTest(req, res, next) {
  res.render('about/fm_val_test');
}

function something(req, res, next) {
  res.json({ error: 0 });
}

exports = module.exports = { index, fmValTest, something };
