exports.index = function(req, res, next) {
  gModels.Major.find({}).select('name').exec(function(err, result) {
    res.json(result.map(function(v) { return v.name; }));
  })
};
