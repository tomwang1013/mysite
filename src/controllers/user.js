import User from '../models/user'

function signupHandler(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  let u = new User({ email: email, password: password });

  u.save(function(err, nu) {
    if (err) return next(err);

    res.json({ status: 0, url: '/login' });
  });
}

function emailChecker(req, res, next) {
  let email = req.query.email;

  User.findOne({ 'email': email }, function(err, result) {
    res.json({ error: !!result });
  })
}

export {signupHandler, emailChecker};
