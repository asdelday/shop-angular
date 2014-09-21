// File: Gulpfile.js
'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    inject = require('gulp-inject'),
    wiredep = require('wiredep').stream,
    historyApiFallback = require('connect-history-api-fallback'),
    rename = require('gulp-rename');


/* === GULP SERVER TASK
==============================================================*/
// Servidor web de desarrollo
gulp.task('server', function() {
  connect.server({
    root: './app',
    hostname: '0.0.0.0',
    port: 8080,
    livereload: true,
    middleware: function(connect, opt) {
      return [ historyApiFallback ];
    }
  });
});


/* === GULP JSHINT TASK
==============================================================*/
// Busca errores en el JS y nos los muestra por pantalla
gulp.task('jshint', function() {
  return gulp.src('./app/scripts/**/*.js')
              .pipe(jshint('.jshintrc'))
              .pipe(jshint.reporter('jshint-stylish'))
              .pipe(jshint.reporter('fail'));
});


/* === GULP LESS TASK
==============================================================*/
// Preprocesa archivos Less a CSS y recarga los cambios
gulp.task('styles', function() {
  gulp.src(['./app/stylesheets/main.less'])
      .pipe(less())
      .pipe(minifyCSS())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./app/stylesheets'));
});


/* === GULP HTML TASK
==============================================================*/
// Recarga el navegador cuando hay cambios en el HTML
gulp.task('html', function() {
  gulp.src('./app/**/*.html')
      .pipe(connect.reload());
});


/* === GULP INJECT TASK
==============================================================*/
// Busca en las carpetas de estilos y javascript los archivos que hayamos creado
// para inyectarlos en el index.html
gulp.task('inject', function() {
  var sources = gulp.src(['./app/scripts/**/*.js','./app/stylesheets/**/*.min.css']);
  return gulp.src('index.html', {cwd: './app'})
              .pipe(inject(sources, {
                read: false,
                ignorePath: '/app'
              }))
              .pipe(gulp.dest('./app'));
});


/* === GULP WIREDEP TASK
==============================================================*/
// Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', function () {
  gulp.src('./app/index.html')
      .pipe(wiredep({
        directory: './app/lib'
      }))
      .pipe(gulp.dest('./app'));
});


/* === GULP WATCH TASK
==============================================================*/
// Vigila cambios que se produzcan en el código
// y lanza las tareas relacionadas
gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html'], ['html']);
  //gulp.watch(['./app/stylesheets/**/*.styl'], ['css']);
  //gulp.watch(['./app/scripts/**/*.js'], ['jshint']);
  gulp.watch(['./app/stylesheets/**/*.less'], ['styles', 'inject']);
  gulp.watch(['./app/scripts/**/*.js', './Gulpfile.js'], ['jshint', 'inject']);
  gulp.watch(['./bower.json'], ['wiredep']);
});


/* === GULP DEFAULT TASK
==============================================================*/
// Requerido para comenzar tareas
gulp.task('default', ['server', 'watch', 'jshint', 'inject', 'wiredep']);
