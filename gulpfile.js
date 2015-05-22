/* jshint globalstrict:true */
/* global require, console */
"use strict";

var _ = require("lodash"),
  gulp = require("gulp"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  minifycss = require("gulp-minify-css"),
  rename = require("gulp-rename"),
  sourcemaps = require("gulp-sourcemaps"),
  del = require("del"),
  lazypipe = require("lazypipe"),
  browserSync = require("browser-sync"),
  reload = browserSync.reload;

var srcScss = "./styles.scss",
  srcStatic = "./**/*.+(html|jpg|png|gif|svg)",
  outputCss = "./css",
  cssPipe;

gulp.task("browser-sync", function() {
  browserSync({
    server: {
      baseDir: ['./']
    },
    ui: {
      port: 8000
    },
    files: [
      srcStatic
    ],
    watchOptions: {
      debounceDelay: 500
    },
    open: false
  });
});

cssPipe = lazypipe()
  .pipe(autoprefixer, "{ browsers: ['last 2 version', 'ie 9', '> 5%'], onError: function (err) { console.log(err)} }")
  .pipe(gulp.dest, outputCss)
  .pipe(rename, {
    suffix: ".min"
  })
  .pipe(minifycss)
  .pipe(gulp.dest, outputCss)
  .pipe(reload, {
    stream: true
  });

gulp.task("scss", function() {
  return gulp.src(srcScss)
    .pipe(sass({
        style: 'nested',
        includePaths: [
          './',
          './bower_components/bootstrap-sass/assets/stylesheets/'
        ]
      })
      .on('error', function(error) {
        console.log(error);
      }))
    .pipe(cssPipe());
});

gulp.task("clean", function(cb) {
  del(outputCss, cb);
});

gulp.task("build", ["clean"], function() {
  gulp.start("scss");
});

gulp.task("watch", ["browser-sync"], function() {
  gulp.watch(srcScss, ["scss"]);
  gulp.watch(srcStatic, [reload]);
});

gulp.task('default', function() {
  console.log('Run "gulp watch or gulp build"');
});
