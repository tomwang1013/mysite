import User from '../models/user'

function signupHandler(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let validEmailReg = /\w+@\w+(\.[a-z0-9]{2,12})?\.[a-z]{2,12}/

  if (!email || !password) {
    return res.json({ error: 1, message: 'email or password is empty'});
  }

  if (!validEmailReg.test(email)) {
    return res.json({ error: 1, message: 'please enter a valid email'});
  }

  let u = new User({ email: email, password: password });

  u.save(function(err, nu) {
    if (err) {
      return res.json({ error: 1, message: 'signup failed, please try again later'});
    }

    res.json({ error: 0, redirect_url: '/login' });
  });
}

function loginHandler(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;
  let validEmailReg = /\w+@\w+(\.[a-z0-9]{2,12})?\.[a-z]{2,12}/

  if (!email || !password) {
    return res.json({ error: 1, message: 'email or password is empty'});
  }

  if (!validEmailReg.test(email)) {
    return res.json({ error: 1, message: 'please enter a valid email'});
  }

  // TODO authentication
}

export { signupHandler, loginHandler };
