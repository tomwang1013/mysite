import User from '../models/user'
import bcrypt from 'bcrypt'

const VALID_EMAIL_REG = /\w+@\w+(\.[a-z0-9]{2,12})?\.[a-z]{2,12}/; 
const SALT_ROUNDS = 10;

function signupHandler(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.json({ error: 1, message: 'email or password is empty'});
  }

  if (!VALID_EMAIL_REG.test(email)) {
    return res.json({ error: 1, message: 'please enter a valid email'});
  }

  bcrypt.hash(password, SALT_ROUNDS, function(err, hash) {
    let u = new User({ email: email, password: hash });

    u.save(function(err, nu) {
      if (err) {
        return res.json({ error: 1, message: 'signup failed, please try again later'});
      }

      res.json({ error: 0, redirect_url: '/login' });
    });
  });
}

function loginHandler(req, res, next) {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.json({ error: 1, message: 'email or password is empty'});
  }

  if (!VALID_EMAIL_REG.test(email)) {
    return res.json({ error: 1, message: 'please enter a valid email'});
  }

  User.findOne({ email }, function(err, user) {
    if (!user) {
      return res.json({ error: 1, message: 'user not exist' });
    }

    bcrypt.compare(password, user.password, function(err, match) {
      if (match) {
        req.session.email = email;
        return res.json({ error: 0, email });
      } else {
        return res.json({ error: 1, message: 'user and password not match' });
      }
    });
  })
}

// logout
function logoutHandler(req, res, next) {
  if (req.session.email) {
    req.session.email = null;
  }

  res.redirect('/');
}

export { signupHandler, loginHandler, logoutHandler };
