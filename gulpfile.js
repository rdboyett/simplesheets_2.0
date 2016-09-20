/* eslint-disable no-else-return, no-loop-func */
var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del'); // used for clean-task
var rename = require('gulp-rename');
var plugins = require('gulp-load-plugins')();
var fs = require('fs');
var assign = require('lodash.assign');
var browserify = require('browserify');
var watchify = require('watchify');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var batch = require('gulp-batch');
var shell = require('gulp-shell');
var mocha = require('gulp-spawn-mocha');
var livereload = require('gulp-livereload');
var Promise = require('es6-promise').polyfill();
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sass = require('gulp-sass');
// var sassLint = require('gulp-sass-lint'); // turning off temporarily
var minify = require('gulp-clean-css');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');

var allStylesTasks = [
    'styles-main'
];
var bundlers = {};
var bundlersNeedToWatch = false;

//------------------------------------------------------------------------------
// Build Styles
//------------------------------------------------------------------------------
// NOTE: would love to dynamically create all these tasks from a simple array
// of style bundles we want. I'll leave that for a future task.
gulp.task('styles', allStylesTasks, function() {
    gutil.log('styles build done');
});
gulp.task('styles-thirdparty', function() {
    return buildStyles('thirdparty');
});
function buildStyles(dir) {
    var srcDirs = [
        './frontend/styles/' + dir + '/**/*.scss',
        '!./frontend/styles/' + dir + '/**/_*.scss',  // no underscore files
    ];
    return gulp.src(srcDirs)
       .pipe(sass().on('error', sass.logError))
       /*
        * Turning off SassLint until Jeremy has time to adjust rules in config
       .pipe(sassLint({
           sasslintConfig: './.sass-lint.yml',
       }))
       .pipe(sassLint.format())
       .pipe(sassLint.failOnError())
       */
       .pipe(postcss([ autoprefixer({ browsers: ['last 3 versions'] }) ]))
       .pipe(gulp.dest('./worksheet_project/static/gulp/styles'))
       .pipe(minify())
       .pipe(rename({suffix: '.min'}))
       .pipe(gulp.dest('./worksheet_project/static/gulp/styles'));
}
gulp.task('styles-main', function() {
    return buildStyles('main');
});

gulp.task('browsers', function() {
    /* This is an internal-use command for designers to check the supported
     * browsers for the vague 'last 2 versions' command.
     */
    var info = autoprefixer({ browsers: ['last 2 version'] }).info();
    gutil.log(info);
});


//------------------------------------------------------------------------------
// Build static assets
//------------------------------------------------------------------------------
gulp.task('extras', function() {
    // Robots.txt and favicon.ico, etc.
    return gulp.src([
        'frontend/*.txt',
        'frontend/downloads/*',
        'frontend/*.ico'])
    .pipe(gulp.dest('./worksheet_project/static/gulp/'));
});

//------------------------------------------------------------------------------
// Build Scripts
//------------------------------------------------------------------------------
gulp.task('lint', [
    'lint-main'
]);
function lint(val, failOnError) {
    // Runs ESLint on all application-specific, non-test JS files.
    // See .eshintrc for which syntax settings are being applied.
    var eslintFormatter,
        srcDirs = [
            './frontend/scripts/' + val + '/**/*.js',
            '!./frontend/scripts/' + val + '/**/tests/*.js',
        ];
    if (failOnError) {
        return gulp.src(srcDirs)
            .pipe(eslint())
            .pipe(eslint.format(eslintFormatter))
            .pipe(eslint.failOnError());
    }
    return gulp.src(srcDirs)
        .pipe(eslint())
        .pipe(eslint.format());
}
gulp.task('lint-main', function() {
    return lint('main', false);
});
gulp.task('scripts', [
    'scripts-main',
    'scripts-thirdparty'
]);
function bundleScripts(val, uglyArg, newRelicJS) {
    var bundled, fn;
    var destFolder = './worksheet_project/static/gulp/js/';
    var newrelicJSFile = newRelicJS || '';
    var customOpts, opts;
    var ugly = uglyArg === undefined ? true : uglyArg;
    var entries = ['./frontend/scripts/' + val + '.js'];
    customOpts = {
        entries: entries,
        insertGlobals: true,
        cache: {},
        ignoreWatch: ['**/node_modules/**'],
        noParse: [ 'jquery' ],
        transform: ['browserify-shim'],
        packageCache: {},
        fullPaths: false,
        // `debug` adds sourcemap support. If we minify, it is going
        // to production so turn off sourcemaps.
        debug: !ugly,
    };
    // process.env.NODE_ENV = ugly ? 'production' : ''; // For React.js
    if (bundlersNeedToWatch) {
        gutil.log('Setting up watchers for js scripts...');
        opts = assign({}, watchify.args, customOpts);
        bundlers[val] = watchify(browserify(opts));
        bundlers[val].on('update', function() {
            gutil.log('rebuilding ' + val + ' scripts...');
            bundled = bundlers[val].bundle();
            fn = val + '-bundle.js';
            if (ugly) {
                return bundled.pipe(source(fn))
                    .pipe(buffer())
                    .pipe(uglify())
                    .pipe(gulp.dest(destFolder))
                    .pipe(plugins.size());
            } else {
                return bundled.pipe(source(fn))
                    .pipe(buffer())
                    .pipe(gulp.dest(destFolder))
                    .pipe(plugins.size());
            }
        });
    } else {
        bundlers[val] = browserify(customOpts);
    }
    bundlers[val].on('log', gutil.log);
    bundled = bundlers[val].bundle();
    fn = val + '-bundle.js';
    if (ugly) {
        return bundled.pipe(source(fn))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(gulp.dest(destFolder));
    } else {
        return bundled.pipe(source(fn))
            .pipe(buffer())
            .pipe(gulp.dest(destFolder));
    }
}
// NOTE: would love to make another pass over these and simply have these tasks
// be dynamically created based on an array of script bundles.
gulp.task('scripts-main', function() { return bundleScripts('main'); });
gulp.task('scripts-thirdparty', function() {
    // Some of the third party scripts can be required/bundled but we may want
    // to refer to them directly in static/ so everything within thirdparty is
    // copied to static as-is for that reason.
    return gulp.src([
        'frontend/scripts/thirdparty/*.js',
    ])
    .pipe(gulp.dest('static/scripts/thirdparty/'));
});

//------------------------------------------------------------------------------
// Misc Internal Build Tasks
//------------------------------------------------------------------------------
gulp.task('clean', function(cb) {
    cb(del.sync([
        './worksheet_project/static/gulp/styles',
        './worksheet_project/static/gulp/scripts',
        './worksheet_project/static/gulp/fonts',
        './worksheet_project/static/gulp/*',
    ]));
});

gulp.task('build', ['build-qa']);
gulp.task('build-prod', [
    'styles', 'scripts', 'extras', 'fonts',
]);
gulp.task('build-qa', [
    'styles', 'lint', 'scripts',
    'extras', 'fonts',
]);
gulp.task('build-stage', ['build-qa']); // no difference for scripts/styles

gulp.task('fonts', function() {
    return gulp.src(['frontend/fonts/*'])
        .pipe(gulp.dest('./worksheet_project/static/gulp/fonts/'))
        .pipe(plugins.size());
});

gulp.task('set-watch', function() {
    bundlersNeedToWatch = true;
});

// Watch
gulp.task('watch', ['set-watch', 'build-qa'], function() {
    var i, task, path, parts;
    livereload.listen();

    // Watchify takes care of rebuilding Javascript files because we set the
    // global bundlersNeedToWatch variable prior to doing a QA build.

    // Watch styles files here.
    for (i = 0; i < allStylesTasks.length; i++) {
        task = allStylesTasks[i];
        parts = task.split('-');
        path = './frontend/styles/' + parts[1] + '/**/*.scss';
        (function(p, t) {
            watch(p, batch(function(events, done) {
                gulp.start(t, done);
            }));
        })(path, task);
    }
    // NOTE: CSS and JS files are the most commonly edited files so if you need
    // to have another file type/task watched, feel free to add a watch
    // function (use css example) here.
});

// Default task
gulp.task('default', ['clean', 'watch'], function() {
    // TODO: I would like to get to a point where we can be confident that we
    // are completely done and now watching for chnages, however it seems I can
    // get here before the async scripts bundling that watchify is doing, is
    // truly done. Unfortunate; I need to figure out a way to wait for those.
    var chalk = require('chalk');
    var figlet = require('figlet');
    console.log(
        chalk.green(
            figlet.textSync('Build Done', {horizontalLayout: 'default'})
        )
    );
    gutil.log('-------Done with initial builds of all resources-------');
});
