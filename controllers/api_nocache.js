'use strict'

/*
 * get current user's info
 */
function userInfo(req, res, next) {
  gModels.User.findOne({ _id: req.currentUser.id }).exec().then(function(user) {
    // nginx failed: add_header Access-Control-Allow-Credentials 'true';
    // so i add it here
    //res.set('Access-Control-Allow-Credentials', 'true');
    res.json(user);
  }).catch(next);
}

module.exports = {
  userInfo
};
