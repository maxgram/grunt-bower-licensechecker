/*
 * grunt-bower-licensechecker
 * https://github.com/max-gram/grunt-bower-licensechecker
 *
 * Copyright © 2015 Max Gram
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function( grunt ) {
  grunt.file.defaultEncoding = 'utf8';
  grunt.task.registerTask( 'bower-licensechecker', 'Check Bower licenses', function() {
    var o = this.options(),
    acceptableList = o.acceptable,

    rootDir = process.cwd() + '/',
    bowerDir = rootDir + (o.directory || 'bower_components'),

    getLicense = function(dir){

      var libLicense;
      try{
        libLicense = grunt.file.readJSON(dir + "/bower.json").license;
      }catch(e){
        console.log("Bower.json doesn't exist", dir);
      }
    };

    grunt.file.expand(bowerDir + "/*").forEach(getLicense);
  });
};
