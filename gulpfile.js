var gulp = require('gulp');
var coveralls = require('gulp-coveralls');



gulp.task('default', function() {
    gulp.src('test/coverage/**/lcov.info')
        .pipe(coveralls());
});