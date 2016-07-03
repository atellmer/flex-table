var gulp = require('gulp');
var stylus = require('gulp-stylus');
var nib = require('nib');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var rev = require('gulp-rev-append');
var clc = require('cli-color');

var config = require('./config');

console.log(clc.green('-------------------------------------------'));
console.log(clc.green('Mode: ') + clc.yellow(config.mode));
console.log(clc.green('Debug: ') + clc.yellow(config.debug));
console.log(clc.green('-------------------------------------------'));

var path = {
	root: 'client/',
	src: function () {
		return this.root + 'src/'
	},
	dist: function () {
		return this.root + 'dist/'
	}
};

var task = {
	componentStyles: '',
	componentTemplates: '',
	hashFiles: ''
};

//connect
gulp.task('connect', function () {
	connect.server({
		root: path.root.slice(0, -1),
		port: 3000,
		livereload: true
	});
});

//component-styles
gulp.task('component-styles', function () {
	task.componentStyles = gulp.src(path.src() + '**/*.styl')
		.pipe(concat('bundle.styl'))
		.pipe(stylus({
			use: [nib()],
			compress: !config.debug
		}))
		.pipe(gulp.dest(path.dist()))
		.pipe(connect.reload());
			
	return task.componentStyles;
});

//component-templates
gulp.task('component-templates', function () {
	task.componentTemplates = gulp.src(path.root + '**/*.html')
		.pipe(connect.reload());
		
	return task.componentTemplates;
});

//hash-files
gulp.task('hash-files', function () {
	task.hashFiles = gulp.src(path.root + '**/*.html')
		.pipe(rev())
		.pipe(gulp.dest(function (file) {
			return file.base;
		}))
		.pipe(connect.reload());
		
	return task.hashFiles;
});

//watch
gulp.task('watch', function () {
	gulp.watch(path.src() + '**/*.styl', ['component-styles', 'hash-files']);
	gulp.watch(path.root + '**/*.html', ['component-templates']);
});

gulp.task('default', [
	'connect', 
	'component-styles', 
	'component-templates', 
	'hash-files',
	'watch'
]);