// Include gulp
var gulp = require("gulp");

// Include Our Plugins
var wiredep = require("wiredep");
var plugins = require("gulp-load-plugins")();

gulp.task("bower-scripts", function () {
  return gulp.src(wiredep().js).pipe(gulp.dest("src/assets/bower/js"));
});

gulp.task("bower-css", function () {
  return gulp.src(wiredep().css).pipe(gulp.dest("src/assets/bower/css"));
});

gulp.task("bower-fonts", function () {
  return gulp
    .src(["bower_components/foundation-icon-fonts/*.{eot,svg,ttf,woff}"])
    .pipe(gulp.dest("src/assets/bower/css"));
});

gulp.task("index", ["bower-scripts", "bower-css", "bower-fonts"], function () {
  return gulp
    .src("src/index.html")
    .pipe(
      wiredep.stream({
        fileTypes: {
          html: {
            replace: {
              js: function (filePath) {
                return (
                  '<script src="' +
                  "/assets/bower/js/" +
                  filePath.split("/").pop() +
                  '"></script>'
                );
              },
              css: function (filePath) {
                return (
                  '<link rel="stylesheet" href="' +
                  "/assets/bower/css/" +
                  filePath.split("/").pop() +
                  '"/>'
                );
              },
            },
          },
        },
      })
    )

    .pipe(
      plugins.inject(
        gulp.src(
          [
            "src/assets/**/*.js",
            "!src/assets/bower/**/*",
            "!src/assets/shadow/**/*",
          ],
          {
            read: false,
          }
        ),
        {
          addRootSlash: true,
          ignorePath: "src",
          transform: function (filePath, file, i, length) {
            return '<script src="' + filePath + '"></script>';
          },
        }
      )
    )

    .pipe(
      plugins.inject(
        gulp.src(
          [
            "src/assets/**/*.css",
            "!src/assets/bower/**/*",
            "!src/assets/shadow/**/*",
          ],
          {
            read: false,
          }
        ),
        {
          addRootSlash: true,
          ignorePath: "src",
          transform: function (filePath, file, i, length) {
            return '<link rel="stylesheet" href="' + filePath + '"/>';
          },
        }
      )
    )

    .pipe(gulp.dest("src/"));
});

// Default Task
gulp.task("default", ["index"]);
