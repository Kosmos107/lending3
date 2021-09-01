let projectFolder = "work"; // папка где будет результат
let sourceFolder = "#src"; //папка с исходниками
let path = {  //пути  к разным файлам
    build: {
        html: projectFolder + "/",
        css: projectFolder + "/css/",
        js: projectFolder + "/js/",
        img: projectFolder + "/img/",
        font: projectFolder + "/fonts/",
    },
    src: {
        html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
        css: sourceFolder + "/scss/style.scss",
        js: sourceFolder + "/js/script.js",
        js: sourceFolder + "/js/*.js",
        img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",//звездочка чтобы слушать все папки и задаем определенные файлы
        font: sourceFolder + "/fonts/*.ttf",
    },
    watch: {//ослеживает файлы
        html: sourceFolder + "/**/*.html",
        css: sourceFolder + "/scss/**/*.scss",
        js: sourceFolder + "/js/**/*.js",
        img: sourceFolder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean: "./" + projectFolder + "/"
}


let { src, dest } = require('gulp');
let gulp = require('gulp');
let browserSync = require('browser-sync').create();
let fileinclude = require("gulp-file-include");
let del = require('del');
let scss = require('gulp-sass')(require('sass'));
let autoprefixer = require("gulp-autoprefixer");
let groupMedia = require("gulp-group-css-media-queries");
let cleanCss = require('gulp-clean-css');
let rename = require("gulp-rename");
let uglify = require('gulp-uglify-es').default;
let imagemin = require("gulp-imagemin");
// let webp = require("gulp-webp");
// let webphtml = require("gulp-webp-html");
// let webpcss = require('gulp-webpcss')


function browser() { //функция чтобы запускать браузер авт
    browserSync.init({
        server: {
            baseDir: "./" + projectFolder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        // .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())


}

function images() {
    return src(path.src.img)
        // .pipe(
        //     webp({
        //         quality: 70
        //     })
        // )
        .pipe(dest(path.build.img))
        //  .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgPlugins: [{ removeVieBox: false }],
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browserSync.stream())
}


function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(
            groupMedia()
        )

        .pipe(dest(path.build.css))
        .pipe(
            cleanCss()
        )
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream())


}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream())


}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images)
}

function clean() {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images));//функци которое должны выполняться
let watch = gulp.parallel(build, browser, watchFiles);//функция за 


exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

