// 根据名称前缀查找标签
function search(req, res, next) {
  gModels.QuesLabel.
    find({ name: { $regex: req.query.name } }).
    lean().
    select('name ques_cnt').
    sort({ ques_cnt: -1 }).
    exec(function(err, labels) {
      res.json({ error: 0, labels: labels || [] });
    });
}

// 当输入的标签不存在时创建标签
// TODO 标签的唯一性：如果存在标签，不创建，直接返回
function create(req, res, next) {
  gModels.QuesLabel.create({
    name: req.body.name,
    ques_cnt: 1
  }).then(function(error, result) {
    res.json({ error: 0 });
  });
}

exports = module.exports = { search, create };
