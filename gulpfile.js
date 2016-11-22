/* by anjor*/
var gulp = require('gulp'),
    minifycss = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    htmlmin = require("gulp-htmlmin");
    useref = require('gulp-useref'),
    gulpif = require("gulp-if"),
    base64 = require('gulp-base64'),
    browsersync = require('browser-sync'),
    reload = browsersync.reload,
	autoprefixer = require('gulp-autoprefixer');
var SRCPATH = 'src/';   //源文件目录
var PUBLISH = 'publish/';		//发布目录
//语法检查
gulp.task('jshint', function() {
    return gulp.src(SRCPATH+'js/util/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
//压缩css
gulp.task('minifycss', function() {
    return gulp.src([SRCPATH+'css/*.css'])    //需要操作的文件
        .pipe(concat('main.css'))
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(minifycss())   //执行压缩
        .pipe(gulp.dest(PUBLISH+'css'));   //输出文件夹
});
//压缩,合并 js
gulp.task('minifyjs', function() {
    //压缩libs
        gulp.src([SRCPATH+'js/libs/*.js',SRCPATH+'js/animate/*.js'])      //需要操作的文件
        .pipe(concat('libs.js'))    //合并所有js到main.js
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest(PUBLISH+'js/'));  //输出
    //压缩app
    gulp.src([SRCPATH+'js/app/*.js'])      //需要操作的文件
        .pipe(concat('app.js'))    //合并所有js到main.js
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest(PUBLISH+'js'));  //输出
});
//压缩html
gulp.task('htmlmin',function(){
    var options = {
        collapseWhitespace:true,
        collapseBooleanAttributes:true,
        removeComments:true,
        removeEmptyAttributes:true,
        removeScriptTypeAttributes:true,
        removeStyleLinkTypeAttributes:true,
        minifyJS:true,
        minifyCSS:true
    };
    gulp.src('src/index.html')
        .pipe(concat('index.html'))
        .pipe(gulp.dest(PUBLISH));
});
//less 任务
gulp.task('less', function(){
  return gulp.src(SRCPATH+'css/*.less')
    .pipe(less({ compress: true }))
    .on('error', function(e){console.log(e);} )
    .pipe(gulp.dest(SRCPATH+'css/'))
	.pipe(reload({stream: true}));

});
gulp.task('testAutoFx', ['less'], function () {
    gulp.src(SRCPATH+'css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: false, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(gulp.dest(SRCPATH+'css'));
});
gulp.task('copyimg', function(){
    return gulp.src(SRCPATH+'images/**')
        .pipe(gulp.dest(PUBLISH+"images"));
});
gulp.task('copymedia', function(){
    return gulp.src(SRCPATH+'media/**')
        .pipe(gulp.dest(PUBLISH+"media"));
});
// autoSprite, with media query
gulp.task('autoSprite',['less'], function() {
    gulp.src(SRCPATH+'css/*.css').pipe(cssSprite({
            imagepath: SRCPATH+'images/slice/',
            imagepath_map: null,
            spritedest: SRCPATH+'./images/',
            spritepath: '../images/',
            padding: 5,
            useimageset: false,
            newsprite: true,
            spritestamp: true,
            cssstamp: false
        }))
        .pipe(gulp.dest('./'));
});
gulp.task('useref', function () {
    return gulp.src(SRCPATH+'*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifycss()))
		.pipe(gulpif('*.css',
			base64({
				baseDir: SRCPATH+'images/',
				extensions: ['png', 'jpg'],
				maxImageSize: 20 * 1024, // bytes
				debug: false
			})
		))
        .pipe(gulp.dest(PUBLISH));
});
gulp.task('base64', function() {
  return gulp.src(SRCPATH+'css/*.css')
    .pipe(base64({
		baseDir: 'src/',
		extensions: ['png', 'jpg'],
		maxImageSize: 20 * 1024, // bytes
		debug: false
	}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('browser-sync', ['less'], function() {
    browsersync.init({
        server: SRCPATH
    });
    gulp.watch(SRCPATH+"css/*.less", ['less']);
    gulp.watch(SRCPATH+"**").on('change', function(ev){
        console.log(ev.path);
        reload();
    });
});
//注册watch事件，监听src目录下文件修改，实现自动刷新页面，支持多浏览器同步刷新
gulp.task('watch', ['browser-sync'], function(){
	
});
//默认命令,在cmd中输入gulp后,执行的就是这个任务(压缩js需要在检查js之后操作)
gulp.task('publish',['testAutoFx', 'jshint', 'copyimg', 'copymedia'], function() {
	gulp.start('useref');
});