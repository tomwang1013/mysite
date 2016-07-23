var gulp        = require('gulp');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var uglify      = require('gulp-uglify');
var buffer      = require('vinyl-buffer');
var sourcemaps  = require('gulp-sourcemaps');
var sass        = require('gulp-sass');

gulp.task('vendor.js', function() {
  return browserify()
    .require('jquery')
    .add(['./node_modules/jquery-validation/dist/jquery.validate.js',
          './node_modules/jquery-validation/dist/additional-methods.js',
          './assets/js/common.js'])
    .bundle()
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('bundle.js', function() {
  return browserify({
    entries: './assets/js/main.js',
    debug:   true
  }).external('jquery')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('sass', function () {
  return gulp.src('./assets/sass/**/[^_]*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./assets/sass/**/*.scss', ['sass']);
});

gulp.task('watch', function() {
  gulp.watch('./assets/js/**/*.js', ['bundle.js']);
});
