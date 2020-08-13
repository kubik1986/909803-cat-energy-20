const { src, dest, parallel, series, watch } = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sync = require('browser-sync').create();
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const concat = require('gulp-concat');
const order = require('gulp-order');
const uglify = require('gulp-terser');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const ghPages = require('gh-pages');

// Images

const images = () => {
  return src('source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.mozjpeg({
        quality: 80,
        progressive: true
      }),
      imagemin.svgo({
        plugins: [
          {removeViewBox: false}
        ]
      })
    ]))
    .pipe(dest('source/img'));
}

const webpImages = () => {
  return src('source/img/**/!(bg-*).{png,jpg}')
  .pipe(webp({
    quality: 90
  }))
  .pipe(dest('source/img'));
}

exports.images = images;
exports.webpImages = webpImages;

// SVG sprite

const sprite = () => {
  return src('source/img/icon-*.svg')
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {removeAttrs: {attrs: '(fill|stroke)'}}
        ]
      })
    ]))
    .pipe(svgstore())
    .pipe(rename('sprite.svg'))
    .pipe(dest('build/img'));
}

exports.sprite = sprite;

// HTML

const html = () => {
  return src('source/*.html')
  .pipe(htmlmin(
    {collapseWhitespace: true}
  ))
  .pipe(dest('build'));
}

exports.html = html;

// CSS

const css = () => {
  return src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(dest('source/css'))
    .pipe(csso())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(sourcemap.write('.'))
    .pipe(dest('build/css'))
    .pipe(sync.stream());
}

exports.css = css;

//JS

const jsConcat = () => {
  return src('source/js/modules/**/*.js')
    .pipe(plumber())
    .pipe(order([
      '!main.js',
      '*.js'
    ]))
    .pipe(concat('app.js'))
    .pipe(dest('source/js'));
}

const jsMin = () => {
  return src([
    'source/js/app.js',
    'source/js/lib/**/*.js'
  ])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(dest('build/js'));
}

const js = series(jsConcat, jsMin);

exports.js = js;

// Clean

const clean = (done) => {
  del.sync('build');
  done();
}

exports.clean = clean;

// Copy

const copy = () => {
  return src([
    'source/fonts/**/*.{woff,woff2}',
    'source/img/**',
    'source/*.ico'
  ], {
    base: 'source'
  })
    .pipe(dest('build'));
}

exports.copy = copy;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

const reload = (done) => {
  sync.reload();
  done();
}

exports.server = server;
exports.reload = reload;

// Watcher

const watcher = () => {
  watch('source/sass/**/*.scss', css);
  watch('source/*.html', series(html, reload));
  watch('source/img/icon-*.svg', series(sprite, reload));
  watch(['source/js/modules/**/*.js', 'source/js/lib/**/*.js'], series(js, reload));
}

// Build

const build = series(
  clean,
  parallel(
    copy,
    css,
    sprite,
    html,
    js
  )
);

exports.build = build;

// Start

exports.start = series(
  build,
  server,
  watcher
);

// Deploy

const deploy = (cb) => {
  ghPages.publish('build', cb);
}

exports.deploy = deploy;
