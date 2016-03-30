var gulp        = require('gulp');
var babel       = require('gulp-babel');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var streamify   = require('gulp-streamify');

var dependencies = ['react', 'react-dom', 'react-router']

gulp.task('vendor-concat', function() {
  return gulp.src(['./node_modules/jquery/dist/jquery.min.js',
                   './node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js'])
    .pipe(concat('vendor.js'))
    .pipe(streamify(uglify({ mangle: false })))
    .pipe(gulp.dest('public/js'));
});

/*
 * bundle common third-party packages
 */
gulp.task('vendor-bundle', function() {
  return browserify()
  .require(dependencies)
  .bundle()
  .pipe(source('vendor.bundle.js'))
  .pipe(streamify(uglify({ mangle: false })))
  .pipe(gulp.dest('public/js'));
});

/*
 * client js bundle
 */
gulp.task('main-bundle', function() {
  browserify('src/app/main.js')
    .external(dependencies)
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('public/js'))
});

/*
 * server js transfork
 */
gulp.task('server-babel', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('dest'));
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*.js'], ['server-babel']);
  gulp.watch(['src/app/**/*.js'], ['main-bundle']);
});

// css
gulp.task('css', function() {
  return gulp.src('src/app/stylesheets/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css'));
});

gulp.task('default', ['watch']);
