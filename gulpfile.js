var gulp        = require('gulp');
var babel       = require('gulp-babel');
var rename      = require('gulp-rename');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');

/*
 * react server render transfor
 */
//gulp.task('server-render', function() {
  //return gulp.src(['middleware/render.js'])
    //.pipe(babel())
    //.pipe(rename(function(path) {
      //path.basename += '-babeled';
      //return path;
    //}))
    //.pipe(gulp.dest('middleware'));
//});

//gulp.task('server-routes', function() {
  //return gulp.src(['app/routes.js'])
    //.pipe(babel())
    //.pipe(rename(function(path) {
      //path.basename += '-babeled';
      //return path;
    //}))
    //.pipe(gulp.dest('app'));
//});

//gulp.task('server', ['server-render', 'server-routes']);

/*
 * client js bundle
 */
gulp.task('client-bundle', function() {
  browserify('app/main.js')
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('public/js'))
});
