var gulp = require('gulp');
var browserify = require('browserify');
var literalify = require('literalify');
var source = require('vinyl-source-stream');

gulp.task('rebrowserify', function(){
  return browserify('./browser.js')
    .transform(literalify.configure({
      'react': 'window.React',
      'react-dom': 'window.ReactDOM',
    }))
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/'));
})

gulp.task('watch', function(){
  gulp.watch('./browser.js', ['rebrowserify']);
})

gulp.task('default', ['watch']);