// 根据名称前缀查找标签
function search(req, res, next) {
  let lab = req.query.lab;

  gModels.QuesLabel.find().
    regex('name', lab).
    lean().
    sort({ ques_cnt: -1 }).
    exec(function(err, labels) {
      res.json({ error: 0, labels });
    });
}

// 当输入的标签不存在时创建标签
function create(req, res, next) {
  gModels.QuesLabel.create({
    name: req.body.name,
    ques_cnt: 1
  }).then(function(error, result) {
    res.json({ error: 0 });
  });
}

exports = module.exports = { search, create };
