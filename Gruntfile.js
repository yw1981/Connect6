module.exports = function(grunt) {

  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        strict: true,
        undef: true,
        unused: true,
        bitwise: true,
        forin: true,
        freeze: true,
        latedef: true,
        noarg: true,
        nocomma: true,
        nonbsp: true,
        nonew: true,
        notypeof: true,
        singleGroups: true,
        jasmine: true,
        jquery: true,
        globals: {
          module: false, // for Gruntfile.js
          exports: false, // for protractor.conf.js
          inject: false, // testing angular
          angular: false,
          console: false,
          browser: false, element: false, by: false, // Protractor
        },
      },
      all: ['Gruntfile.js', 'test/karma.conf.js', 'test/protractor.conf.js', 'app/ts_output_readonly_do_NOT_change_manually/app/src/*.js', 'test/unit/*.js', 'test/e2e/*.js', 'app/languages/*.js']
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        background: true,
        singleRun: false
      }
    },
    // Run karma and watch files using:
    // grunt karma:unit:start watch
    watch: {
      files: ['app/js/*.js', 'test/unit/*.js', 'test/e2e/*.js'],
      tasks: ['jshint', 'karma:unit:run']
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        // Order is important! gameLogic.js must be first because it defines myApp angular module.
        src: ['app/ts_output_readonly_do_NOT_change_manually/app/src/gameLogic.js', 'app/ts_output_readonly_do_NOT_change_manually/app/src/game.js', 'app/ts_output_readonly_do_NOT_change_manually/app/src/aiService.js'],
        dest: 'app/dist/everything.js',
      },
    },
    uglify: {
      options: {
        sourceMap: true,
      },
      my_target: {
        files: {
          'app/dist/everything.min.js': ['app/dist/everything.js']
        }
      }
    },
    processhtml: {
      dist: {
        files: {
          'app/game.min.html': ['app/game.html'],
        }
      }
    },
    manifest: {
      generate: {
        options: {
          basePath: 'app',
          cache: [
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.min.js',
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-touch.min.js',
            'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.12.1/ui-bootstrap-tpls.min.js',
            'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css',
            'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/fonts/glyphicons-halflings-regular.woff',
            'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/fonts/glyphicons-halflings-regular.ttf',
            'http://yoav-zibin.github.io/emulator/dist/turnBasedServices.3.min.js',
            'http://yoav-zibin.github.io/emulator/main.css',
            'dist/everything.min.js',
            'css/game.css',
            'imgsrc/black.png',
            'imgsrc/white.png',
            'imgsrc/wood.jpg',
            'imgsrc/HelpSlide1.jpg',
            'imgsrc/HelpSlide2.jpg',
            'imgsrc/HelpSlide3.jpg',
          ],
          network: [
            'dist/everything.min.js.map',
            'languages/zh.js',
            'languages/en.js',
            'dist/everything.js',
          ],
          timestamp: true
        },
        dest: 'app/game.appcache',
        src: []
      }
    },
    'http-server': {
        'dev': {
            // the server root directory
            root: '.',
            port: 9000,
            host: "0.0.0.0",
            cache: 1,
            showDir : true,
            autoIndex: true,
            // server default file extension
            ext: "html",
            // run in parallel with other tasks
            runInBackground: true
        }
    },
    protractor: {
      options: {
        configFile: "test/protractor.conf.js", // Default config file
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
          // Arguments passed to the command
        }
      },
      all: {}
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-manifest');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-protractor-runner');

  // Default task(s).
  grunt.registerTask('default', ['karma',
      'concat', 'uglify',
      'processhtml', 'manifest',
      'http-server']);

};
