export default function errorHandler(err, req, res, next) {
  console.error(err);

  res.status(500).send('出错了');
}
