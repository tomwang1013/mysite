const path = require('path');

module.exports = {
  entry: ['./assets/js/answers.js', './assets/js/home.js'],
  resolve: {
    modules: [path.resolve(__dirname, 'assets/js'), 'node_modules']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  }
};
