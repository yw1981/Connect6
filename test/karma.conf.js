module.exports = function (config) {
  
  'use strict';
  
  config.set({

    basePath : '../',

    files : [
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.js',
      'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-mocks.js',
      'app/js/gameLogic.js',
      'test/unit/gameLogic_test.js',
      'test/unit/gameLogic_test_chen.js',
      'test/unit/gameLogic_test_HuiYang.js',
      'http://yoav-zibin.github.io/emulator/alphaBetaService.js',
      'app/js/aiService.js',
      'test/unit/aiService_test.js'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'app/js/gameLogic.js': ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-coverage'
    ]

  });
};
