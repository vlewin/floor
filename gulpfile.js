var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  templatecache: ['./www/templates/**/*.html'],
  sass: ['./scss/**/*.scss'],
  css: ['./www/css/*.css'],
  js: ['./www/js/*.js']
};

gulp.task('default', ['templatecache', 'css']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('css', function(done) {
  var source = [
    "./www/lib/ionic/css/ionic.css",
    "./www/css/*.css"
  ];

  gulp.src(source)
  .pipe(concat('source.min.css'))
  .pipe(minifyCss({
    keepSpecialComments: 0
  }))
  .pipe(gulp.dest('./www/dist/'))
  .on('end', done);
});

gulp.task('templatecache', function (done) {
  gulp.src('./www/templates/**/*.html')
    .pipe(templateCache({standalone:true}))
    .pipe(gulp.dest('./www/js'))
    .on('end', done);
});

gulp.task('js', function(done) {
  var source =  [
    "./www/lib/ionic/js/ionic.bundle.min.js",
    "./www/lib/ionic/js/angular/angular-resource.min.js",
    './www/js/*.js'
  ]

  gulp.src(source)
  .pipe(concat('source.min.js'))
  .pipe(gulp.dest('./www/dist/'))
  .on('end', done);
});


gulp.task('watch', function() {
  // gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.templatecache, ['templatecache']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
