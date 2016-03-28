import User from '../models/user'

function signup(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  let u = new User({ email: email, password: password });

  u.save(function(err, nu) {
    if (err) return next(err);

    res.json({ status: 0, url: '/signin' });
  });
}

export default signup;
