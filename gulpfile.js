var gulp = require("gulp");
var concat = require("gulp-concat");
var order = require("gulp-order");
var sourcemaps = require("gulp-sourcemaps");
var watch = require("gulp-watch");

gulp.task("build-js", function () {
    gulp
        .src("static/js/**/*.js")
        .pipe(
            order(
                [
                    "components/*.js",
                    "app.js"
                ],
                {
                    base: "static/js/"
                }
            )
        )
        .pipe(sourcemaps.init())
        .pipe(concat("main.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("static/dist/"));
});

gulp.task("build-css", function () {
    gulp
        .src("static/css/**/*.css")
        .pipe(
            order(["base.css"], {
                base: "static/css/"
            })
        )
        .pipe(sourcemaps.init())
        .pipe(concat("layout.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("static/dist/"));
});

gulp.task("watch-js", function () {
    gulp.watch("static/js/**/*.js", ["build-js"]);
});

gulp.task("watch-css", function () {
    gulp.watch("static/css/**/*.css", ["build-css"]);
});

gulp.task("build", ["build-js", "build-css"]);

gulp.task("default", ["build", "watch-js", "watch-css"]);
