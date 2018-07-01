/**
 *  Require packages
 */
var r = require;
var gulp          = r('gulp'),
    compass       = r('gulp-compass'),
    cssmin        = r('gulp-cssmin'),
    sass          = r('gulp-sass'),
    concat        = r('gulp-concat'),
    jshint        = r('gulp-jshint'),
    jshintStylish = r('jshint-stylish');
    uglify        = r('gulp-uglify'),
    rename        = r('gulp-rename'),
    watch         = r('gulp-watch'),
    browserify    = r('gulp-browserify'),
    browserSync   = r('browser-sync'),
    nodemon       = r('gulp-nodemon'),
    runSequence   = r('run-sequence'),
    dotenv        = r('dotenv').config();

/**
 * Configuration assets of project
 */
var project = {
    basePath: './',
    origin_port: parseInt(process.env.APP_PORT),
    proxy_port: parseInt(process.env.APP_PORT_PROXY),
    init: function() {
        this.scripts        = this.basePath + '/public/scripts';
        this.stylesheets    = this.basePath + '/public/stylesheets';
        this.js             = this.basePath + '/public/js';
        this.css            = this.basePath + '/public/css';
        this.fonts          = this.basePath + '/public/fonts';
        this.bower          = this.basePath + '/public/bower';
        this.proxy          = 'http://localhost:' + this.proxy_port;
        this.banner         = '/**\n' +
                              ' * <%= pkg.name %>\n' +
                              ' * <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                              ' */\n';
        return this;
    }
}.init();

gulp.task('setenv', function() {
    return (process.env.PORT = project.origin_port);
});

gulp.task('libjs', function() {
    return gulp.src([
        project.bower + '/jquery/dist/jquery.min.js',
        project.bower + '/bootstrap/dist/js/bootstrap.min.js'
    ])
    .pipe(concat('libs.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(project.js));
});

gulp.task('libcss', function() {
    var cssTask = gulp.src([
        project.bower + '/bootstrap/dist/css/bootstrap.min.css',
        project.bower + '/bootstrap/dist/css/bootstrap-theme.min.css',
        project.bower + '/font-awesome/css/font-awesome.min.css'
    ])
    .pipe(concat('libs.css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(project.css));

    var fontTask = gulp.src([
        project.bower + '/bootstrap/dist/fonts/*',
        project.bower + '/font-awesome/fonts/*'
    ])
    .pipe(gulp.dest(project.fonts));

    return [cssTask, fontTask];
});

gulp.task('js', function() {
    return gulp.src([project.scripts + '/*.js', '!' + project.scripts + '/*.min.js'])
        .pipe(jshint())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(project.js));
});

gulp.task('jslint', function() {
    gulp.src('*.js')
        .pipe(jshint({ expr: true, boss: true }))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('css', function() {
    return gulp.src(project.stylesheets + '/*.scss')
        .pipe(compass({
            css: project.css,
            sass: project.stylesheets
        }))
        .pipe(gulp.dest(project.css))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(project.css));
});

gulp.task('sass', function () {
    return gulp.src(project.stylesheets + './sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
    gulp.watch(project.stylesheets + './sass/**/*.scss', ['sass']);
});

gulp.task('nodemon', function(callback) {
    var called = false;
    var stream = nodemon({
        script: 'bin/www',
        env: {'NODEMON': true},
        ext: 'js',
        ignore: ['.sass-cache/**/*', 'assets/**/*.*'],
        watch: ['bin/www', 'app.js', 'app/**/*.js'],
        tasks: ['jslint'],
        verbose: true
    });

    stream.on('start', function onStart() {
        console.log('Nodemon: Started!');
        // Ensure start only got called once
        if (!called) { callback(); }
        called = true;
    }).on('restart', function() {
        console.log('Nodemon: Restarted!');
    }).on('crash', function() {
        console.error('Nodemon: Application has crashed!\n');
        stream.emit('restart', 10);
    }).once('exit', function() {
        console.log('Nodemon: Exiting the process');
        // process.exit();
    });
});

gulp.task('browser-sync', ['nodemon'], function() {
    return browserSync.init(null, {
        proxy: {
            target: project.proxy,
            ws: true
        },
        files: ['public/**/*.{html,htm,css,js,png,jpg}', 'app/views/**/*.*'],
        browser: [],
        port: project.origin_port,
        ghostMode: false,
        open: 'external',
    });
});

/**
 * Default task
 */
gulp.task('default', ['setenv', 'libjs', 'libcss', 'js', 'css']);

/**
 * Watch task
 */
gulp.task('watch', function() {
    gulp.watch(project.scripts + '/*.js', ['js']);
    gulp.watch(project.stylesheets + '/*.scss', ['css']);
});

/**
 * Start task
 */
gulp.task('start', ['default', 'browser-sync'], function() {
    gulp.watch(project.scripts + '/*.js', ['js'], function() {
        browserSync.reload();
    });
    gulp.watch(project.stylesheets + '/*.scss', ['css'], function() {
        browserSync.reload();
    });
});