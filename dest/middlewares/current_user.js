"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res, next) {
  if (req.session && req.session.email) {
    req.currentUser = { email: req.session.email };
  }

  next();
};