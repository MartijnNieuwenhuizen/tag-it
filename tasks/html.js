import { html as config } from '../config';
import { reload as browsersync } from 'browser-sync';
import fs from 'fs';
import gulp from 'gulp';
import data from 'gulp-data';
import render, { nunjucks } from 'gulp-nunjucks-render';
import watch from 'gulp-watch';

/**
 * Task: HTML Compile
 */
gulp.task('html', () => {
    return gulp.src(config.src.templates)
        .pipe(data(getViewData))
        .pipe(render({
            path: [
                config.src.templatesDir,
                config.src.layoutDir,
                config.src.componentsDir
            ]
        }))
        .pipe(gulp.dest(config.dist.base))
        .on('end', () => {
            browsersync();
        });
});

/**
 * Task: HTML Watch
 */
gulp.task('html-watch', cb => {
    const paths = config.src;
    watch([paths.templates, paths.layout, paths.components, paths.componentsJSON],
        () => gulp.start(['html'], cb));
});

/**
 * @param {string} file
 * @returns {boolean}
 */
function fileExists(file) {
    try {
        return fs.statSync(file).isFile();
    } catch (e) {}
    return false;
}

/**
 * @param {string} pathSpec
 */
function requireNoCache(pathSpec) {
    delete require.cache[require.resolve(pathSpec)];
    return require(pathSpec);
}

/**
 * @param {Vinyl} file
 * @returns {{}} viewData object
 */
function getViewData(file) {

    // Load viewData file if available on disk
    const viewDataFile = file.path.replace('.html', '-data.json');
    const viewData = fileExists(viewDataFile) ? requireNoCache(viewDataFile) : {};

    // Load translations file if available on disk
    const translationsFile = file.path.replace('.html', '-translations.json');
    const translations = fileExists(translationsFile) ? requireNoCache(translationsFile) : {};

    // Define template functions to include components, viewData and translations
    const include = (file, viewData) => nunjucks.render(`${config.src.componentsDir}/${file}`, viewData);
    const json = file => requireNoCache(`${config.src.componentsDir}/${file}`);

    return {
        baseUri: config.baseUri.templates,
        viewData,
        translations,
        include,
        json
    };
}
