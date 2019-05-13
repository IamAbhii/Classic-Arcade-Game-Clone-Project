const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

gulp.task('styles', () => {
  return gulp.src('./src/css/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
    }))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest('./dest/css'))
    .pipe(browserSync.stream());
})

gulp.task('imagemin', () => {
  return gulp.src('./src/images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dest/images'));
})

gulp.task('babel', () => {
  return gulp.src('./src/js/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dest/js'))
    .pipe(browserSync.stream());
})

gulp.task('copy-html', () => {
  return gulp.src('./index.html')
    .pipe(gulp.dest('dest/'))
    .pipe(browserSync.stream());
})

gulp.task('all', gulp.series('styles', 'imagemin', 'babel', 'copy-html', () => {

  gulp.watch(['./src/css/**/*.css', './src/js/**/*.js', './dest/index.html'], gulp.series('styles', 'babel', 'copy-html'))

  browserSync.init({
    server: {
      baseDir: "./dest"
    }
  });
}))