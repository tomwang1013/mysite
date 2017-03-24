'use strict'

/*
 * get students' const info:
 * universities
 * majors
 * entryDates
 */
function stdConsts(req, res, next) {
  Promise.all([
    gModels.University.all(),
    gModels.Major.all()
  ]).then(function(result) {
    res.json({
      universities: result[0],
      majors:       result[1],
      entryDates:   gModels.User.allEntryDates,
    });
  }).catch(next);
}

/*
 * get companies' const info:
 * businesses
 * scales
 * maturities
 */
function cmpConsts(req, res, next) {
  res.json({
    businesses:   gModels.Business,
    scales:       gModels.User.scales,
    maturities:   gModels.User.maturities,
  });
}

module.exports = {
  stdConsts, cmpConsts
};
