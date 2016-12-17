'use strict';

var gulp        = require('gulp');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var uglify      = require('gulp-uglify');
var buffer      = require('vinyl-buffer');
var sourcemaps  = require('gulp-sourcemaps');
var sass        = require('gulp-sass');
var glob        = require('glob');
var es          = require('event-stream');
var rev         = require('gulp-rev');
var cleanCSS    = require('gulp-clean-css');
var del         = require('del');
var concat      = require('gulp-concat');

var deps = ['jquery', 'lodash'];

gulp.task('vendor.js', function() {
  return browserify({
    entries: [
    'node_modules/jquery-validation/dist/jquery.validate.js',
    'node_modules/jquery-bar-rating/dist/jquery.barrating.min.js',
    'node_modules/jquery-validation/dist/additional-methods.js',
    'node_modules/jquery-validation/dist/localization/messages_zh.js',
    'assets/js/common'],
    debug: true
  }).require(deps)
    .bundle()
    .pipe(source('vendor.js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('bundle.js', function(done) {
  glob('assets/js/*.js', (err, files) => {
    if (err) {
      return done(err);
    }

    const tasks = files.map(entry => {
      const b = browserify({
        entries:    entry,
        debug:      true
      });

      return b.external(deps).bundle()
      .pipe(source(entry.slice(entry.lastIndexOf('/') + 1)))
      .pipe(gulp.dest('public/js'));
    });

    es.merge(tasks).on('end', done);
  });
});

gulp.task('sass', function () {
  return gulp.src(['assets/sass/**/[^_]*.scss', '!assets/sass/vendor/**/*'])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('vendor.css', function () {
  return gulp.src('assets/sass/vendor/{font-awesome/font-awesome.scss,jquery-bar-rating/fontawesome-stars.scss}')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('public/css/'));
});

// production
gulp.task('clean:js', function () {
  return del('public/js/**/*-*');
});

gulp.task('manifest:js', ['clean:js', 'vendor.js', 'bundle.js'], function() {
  gulp.src(['public/js/+([^-]).js'], { base: 'public' })
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public'))
    .pipe(rev.manifest('rev-manifest.json', { merge: true }))
    .pipe(gulp.dest('.'));
});

gulp.task('clean:css', function () {
  return del('public/css/**/*-*');
});

gulp.task('manifest:css', ['clean:css', 'sass', 'font-awesome'], function() {
  gulp.src(['public/css/+([^-]).css'], { base: 'public' })
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(cleanCSS())
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public'))
    .pipe(rev.manifest('rev-manifest.json', { merge: true }))
    .pipe(gulp.dest('.'));
});

gulp.task('build', ['manifest:js', 'manifest:css']);

// development
gulp.task('watch', function() {
  gulp.watch('assets/sass/**/*.scss', ['sass']);
  gulp.watch('assets/sass/vendor/**/*.scss', ['vendor.css']);
  gulp.watch('assets/js/common/*.js', ['vendor.js']);
  gulp.watch('assets/js/*.js', ['bundle.js']);
});
