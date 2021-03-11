const { src, dest, series, parallel, watch } = require('gulp');
const del = require('delete');

function clean() {
  return del.promise('dist');
}

function copyCode() {
  return src('src/**').pipe(dest('dist'));
}

function copyDependencies() {
  return src(
    'node_modules/webextension-polyfill/dist/browser-polyfill.min.js'
  ).pipe(dest('dist'));
}

const build = series(clean, parallel(copyCode, copyDependencies));

function dev() {
  watch('src/**', { ignoreInitial: false }, build);
}

exports.clean = clean;
exports.build = build;
exports.dev = dev;
exports.default = build;
