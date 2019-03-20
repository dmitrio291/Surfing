const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
// const uglify = require('gulp-uglify');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const media = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const gulpIf = require('gulp-if');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-tinypng');
const newer = require('gulp-newer');
const isDevelopment = false;

/* -------- Server -------- */
gulp.task('server', function () {
  browserSync.init({
    server: {
      port: 9000,
      baseDir: "dist"
    }
  });

  gulp.watch('dist/**/*').on('change', browserSync.reload);
});

/* -------- Pug compile -------- */
gulp.task('templates:compile', function buildHTML() {
  return gulp.src('app/pug/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('dist'));
});

/* -------- Scss compile -------- */
gulp.task('styles:compile', function () {
  return gulp.src('app/sass/main.scss')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['> 0.1%', '> 1%', 'ie 8', 'ie 7'],
      cascade: false
    }))
    .pipe(media())
    .pipe(cleanCSS({
      compatibility: 'ie8',
      level: 2
    }))
    .pipe(rename('main.min.css'))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('dist/css'));
});

/* -------- Js -------- */
gulp.task('js', function () {
  return gulp.src([
      'app/libs/jquery/jquery-3.3.1.min.js',
      'app/libs/owlcarousel2/owl.carousel.min.js',
      'app/js/main.js'
    ])
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('dist/js'));
});

/* -------- Sprite -------- */
gulp.task('sprite', function (cb) {
  var spriteData = gulp.src('app/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.scss'
  }));

  spriteData.img.pipe(gulp.dest('dist/img/'));
  spriteData.css.pipe(gulp.dest('app/css/global/'));
  cb();
});

/* -------- Imagemin -------- */
gulp.task('tinypng', function () {
  gulp.src('app/img/**/*')
    .pipe(newer('dist/img'))
    .pipe(imagemin('s3bVFyRMjDmrVy0b2RldwryMD2GB7vhw'))
    .pipe(gulp.dest('dist/img'));
});

/* -------- Delete -------- */
gulp.task('clean', function del(cb) {
  return rimraf('dist', cb);
});

/* -------- Copy fonts -------- */
gulp.task('copy:fonts', function () {
  return gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'));
});

/* -------- Copy images -------- */
gulp.task('copy:images', function () {
  return gulp.src('app/img/**/*.*')
    .pipe(gulp.dest('dist/img'));
});

/* -------- Copy favicons -------- */
gulp.task('copy:favicons', function () {
  return gulp.src('app/img/*.ico')
    .pipe(gulp.dest('dist/img/favicon'));
});

/* -------- Copy -------- */
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/* -------- Watchers -------- */
gulp.task('watch', function () {
  gulp.watch('app/pug/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('app/sass/**/*.scss', gulp.series('styles:compile'));
  gulp.watch('app/js/**/*.js', gulp.series('js'));
});

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile', 'js', 'copy'),
  gulp.parallel('watch', 'server')
));