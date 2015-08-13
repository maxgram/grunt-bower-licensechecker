/*
 * grunt-bower-licensechecker
 * https://github.com/max-gram/grunt-bower-licensechecker
 *
 * Copyright © 2015 Max Gram
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    config: {
      tsts: '',
    },

    // Syntax
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    'bower-licensechecker': {
      options: {
        directory: 'path/to/bower',
        acceptable: [ 'MIT', 'BSD' ],
        log: {
          printNonBower: true,
          printNoLicense: true,
          printTotal: true,
          warn: true,
          // TODO: outFile: null,
        },
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },

  });

  grunt.loadTasks('tasks');

  grunt.registerTask( 'dev', ['jshint', 'bower-licensechecker'] );
  grunt.registerTask( 'default', 'bower-licensechecker' );
};
