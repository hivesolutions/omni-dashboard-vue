const gulp = require("gulp");
const concat = require("gulp-concat");
const order = require("gulp-order");
const sourcemaps = require("gulp-sourcemaps");

gulp.remote = require("gulp-remote");

var paths = {
    scripts: "static/js/**/*.js",
    css: "static/css/**/*.css"
};

gulp.task("build-js", function() {
    gulp
        .src(paths.scripts)
        .pipe(
            order(
                [
                    "components/*.js",
                    "app.js"
                ], {
                    base: "static/js/"
                }
            )
        )
        .pipe(sourcemaps.init())
        .pipe(concat("main.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("static/dist"));
});

gulp.task("build-css", function() {
    gulp
        .src(paths.css)
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

gulp.task("build-libs", function() {
    gulp
        .remote([
            "https://cdn.jsdelivr.net/npm/vue",
            "https://cdn.jsdelivr.net/npm/vue-resource",
            "https://cdn.jsdelivr.net/npm/vue-carousel"
        ])
        .pipe(sourcemaps.init())
        .pipe(concat("libs.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("static/dist/"));
});

gulp.task("watch-js", function() {
    gulp.watch(paths.scripts, ["build-js"]);
});

gulp.task("watch-css", function() {
    gulp.watch(paths.css, ["build-css"]);
});

gulp.task("watch", ["build", "watch-js", "watch-css"]);

gulp.task("build", ["build-js", "build-css", "build-libs"]);

gulp.task("default", ["build"]);
