var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha');

gulp.task('lint', function() {
  return gulp.src(['./lib/**/*.js', 'Gulpfile.js'])
    .pipe( jshint() )
    .pipe( jshint.reporter( 'jshint-stylish' ) );
});

gulp.task('test', function() {
  return gulp.src('./lib/**/*.js')
    .pipe( mocha({ reporter: 'nyan' }) )
    .on( 'end', function() {
      process.exit();
    })
    .on( 'error', function() {
      process.exit(1);
    });
});

gulp.task('default', ['lint', 'test']);
