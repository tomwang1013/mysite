exports.index = function(req, res, next) {
  gModels.University
    .find({})
    .select('name')
    .sort({ ranking: 1 })
    .exec(function(err, result) {
      res.json(result.map(function(v) {
        return v.name;
      }));
    })
};
