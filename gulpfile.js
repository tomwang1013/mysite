var gulp        = require('gulp');
var babel       = require('gulp-babel');
var rename      = require('gulp-rename');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var sass        = require('gulp-sass');

/*
 * server js transfork
 */
gulp.task('server-babel', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('dest'));
});


/*
 * client js bundle
 */
gulp.task('client-bundle', function() {
  browserify('src/app/main.js')
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('public/js'))
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*.js'], ['server-babel']);
  gulp.watch(['src/app/**/*.js'], ['client-bundle']);
});

// css
gulp.task('css', function() {
  return gulp.src('src/app/stylesheets/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css'));
});

gulp.task('default', ['watch']);
