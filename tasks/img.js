import { img as config } from '../config';
import gulp from 'gulp';
import changed from 'gulp-changed';
import imagemin from 'gulp-imagemin';
import watch from 'gulp-watch';
import svgSprite from 'gulp-svg-sprite';

gulp.task('img', ['img-optimize', 'img-sprite']);

/**
 * Task: Image optimizer
 */
gulp.task('img-optimize', ['img-sprite'], () => {
    return gulp.src(config.src.all)
        .pipe(changed(config.dist.base))
        .pipe(imagemin())
        .pipe(gulp.dest(config.dist.base));
});

/**
 * Task: Image Sprite creator
 */
gulp.task('img-sprite', () => {
    return gulp.src(config.src.imgSprite)
        .pipe(svgSprite(config.svgSprite))
        .pipe(gulp.dest(config.dist.spriteBase));
});

/**
 * Task: Image Watch
 */
gulp.task('img-watch', cb => {
    watch([config.src.all], () => gulp.start(['img'], cb));
});
