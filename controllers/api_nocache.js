'use strict'

/*
 * get current user's info
 */
function userInfo(req, res, next) {
  gModels.User.findOne({ _id: req.currentUser.id }).exec().then(function(user) {
    res.json(user);
  }).catch(next);
}

module.exports = {
  userInfo
};
