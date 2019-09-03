let gulp          = require('gulp'),                  // Gulp
    sass          = require('gulp-sass'),             // Sass
    browserSync   = require('browser-sync'),          // Browser Sync
    concat        = require('gulp-concat'),           // gulp-concat (для конкатенации файлов)
    uglify        = require('gulp-uglifyjs'),         // gulp-uglifyjs (для сжатия JS)
    cssnano       = require('gulp-cssnano'),          // пакет для минификации CSS
    rename        = require('gulp-rename'),           // библиотека для переименования файлов
    del           = require('del'),                   // библиотека для удаления файлов и папок
    imagemin      = require('gulp-imagemin'),         // библиотека для работы с изображениями
    pngquant      = require('imagemin-pngquant'),     // библиотека для работы с png
    cache         = require('gulp-cache'),            // библиотека кеширования
    autoprefixer  = require('gulp-autoprefixer'),		  // библиотека для автоматического добдавления префиксов
    ftp           = require('vinyl-ftp');             // загрузка файлов по ftp

gulp.task('clear', async function () {
  return cache.clearAll();
})

gulp.task('sass', function(){
  return gulp.src('app/sсss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true})) 
});

gulp.task('watch', function() {
  gulp.watch('app/sсss/**/*.scss', gulp.parallel('sass'));
  gulp.watch('app/*.html', gulp.parallel('code'));
  gulp.watch(['app/js/common.js', 'app/libs/**/*.js'], gulp.parallel('scripts'));
});

gulp.task('browser-sync', function() { 
  browserSync({ 
      server: { 
          baseDir: 'app' 
      },
      notify: false
  });
});

gulp.task('scripts', function() {
  return gulp.src([
      	'app/libs/**/*.js'
      ])
      .pipe(concat('libs.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('app/js'));
});

gulp.task('code', function() {
  return gulp.src(['app/js/common.js', 'app/libs/**/*.js', 'app/*.html'])
  .pipe(browserSync.reload({ stream: true }))
});

gulp.task('css-libs', function() {
  return gulp.src('app/libs/**/*.css')
      .pipe(concat('libs.min.css'))
      .pipe(cssnano())
      .pipe(gulp.dest('app/css'));
});

gulp.task('default', gulp.parallel('css-libs', 'sass', 'scripts', 'browser-sync', 'watch'));


// Build
gulp.task('clean', async function() {
  return del.sync('dist');
});

gulp.task('img', async function() {
  return gulp.src('app/images/**/*')
      .pipe(cache(imagemin({
          interlaced: true,
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
      })))
      .pipe(gulp.dest('dist/images'));
});

gulp.task('prebuild', async function() {
  let favicon = gulp.src('app/favicon.ico').pipe(gulp.dest('dist'));
  let buildCss = gulp.src('app/css/**/*.css').pipe(gulp.dest('dist/css'))
  let buildFonts = gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'))
  let buildJs = gulp.src('app/js/**/*.js').pipe(gulp.dest('dist/js'))
  let buildHtml = gulp.src('app/*.html').pipe(gulp.dest('dist'));
  let buildMail = gulp.src('app/mail/**/*.php').pipe(gulp.dest('dist/mail'));
});

gulp.task('build', gulp.parallel('prebuild', 'clean', 'img', 'sass', 'scripts'));

gulp.task( 'deploy', async function () {
 
    let conn = ftp.create( {
        host:     'by137.atservers.net',
        user:     'dveriby',
        password: 'EW2RC3VY',
        parallel: 10
    } );
 
    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src( [ './dist/**' ], { base: '/', buffer: false } )
        .pipe( conn.newer( '' ) ) // only upload newer files
        .pipe( conn.dest( '' ) );
 
} );