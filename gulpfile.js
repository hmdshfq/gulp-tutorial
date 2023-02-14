import gulp from 'gulp';
import browserSync from 'browser-sync';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import concat from 'gulp-concat';
import { deleteAsync } from 'del';

const { src, dest, series, parallel, watch } = gulp;
const sass = gulpSass(dartSass);

const source = 'src';
const destination = 'build';

async function clean() {
    await deleteAsync(destination);
}

async function watcher() {
    await watch(`${source}/css/**/*.css`).on('change', series(css, browserSync.reload));
    await watch(`${source}/scss/**/*.scss`).on('change', series(css, browserSync.reload));
    await watch(`${source}/**/*.html`).on('change', series(html, browserSync.reload));
}

async function html() {
    await src(`${source}/**/*.html`).pipe(dest(`${destination}`));
}

async function css() {
    await src([`${source}/scss/**/*.scss`, `${source}/css/**/*.css`])
        .pipe(sass(
            {
                outputStyle: "compressed"
            }
        ))
        .pipe(concat('main.css'))
        .pipe(dest(`${destination}/css/`));
}

async function server() {
    await browserSync.init({
        notify: false,
        open: false,
        server: {
            baseDir: destination
        }
    })
}

export default series(clean, html, css, server, watcher);
