/**
 * get the current user if login
 */
export default function(req, res, next) {   
  if (req.session && req.session.email) {
    req.currentUser = { email: req.session.email };
  }

  next();
}
