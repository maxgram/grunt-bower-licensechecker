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
    var o = this.options();

    if( !o.directory && grunt.file.isFile( '.bowerrc' ) )
      o.directory = grunt.file.readJSON('.bowerrc').directory;

    var
    licenseGood = [],
    licenseBad = [],
    licenseEmpty = [],
    noBowerJson = [],
    acceptableList = o.acceptable || [],

    rootDir = process.cwd() + '/',
    bowerDir = rootDir + (o.directory || 'bower_components') + '/',

    compareAcceptable = function(license){
      for( var i in acceptableList ) {
        if(license.indexOf(acceptableList[i]) != -1)
          return true;
      }
      return false;
    },

    fillArr = function(arr, pkg, dir){
      arr.push( {
        package: pkg,
        dir: dir
      } );
    },

    getLicense = function(dir){
      var libLicense,
          packageName = String(dir).replace(bowerDir, '');

      try{
        libLicense = grunt.file.readJSON(dir + "/bower.json").license;

        if(typeof libLicense === 'undefined'){
          // No License
          fillArr( licenseEmpty, packageName, dir );

        }else if(typeof libLicense === 'string'){
          // Singe license
          ( compareAcceptable(libLicense) ) ? fillArr( licenseGood, packageName, dir ) : fillArr( licenseBad, packageName, dir );

        }else if(libLicense instanceof Array){
          // Multiple licenses
          for( var i in libLicense ) {
            ( compareAcceptable(libLicense[i]) ) ? fillArr( licenseGood, packageName, dir ) : fillArr( licenseBad, packageName, dir );
          }
        }

      }catch(e){
        // Non-Bower Component
        fillArr( noBowerJson, packageName, dir );
      }
    };

    if(!grunt.file.isDir(bowerDir)){
      grunt.log.error('Please make sure you have right path to bower components folder.');
      return;
    }

    grunt.file.expand(bowerDir + "*").forEach( getLicense );

    if(o.displayTotal){
      grunt.log.ok('Licenses OK: ' + licenseGood.length);
      grunt.log.error('License NOT OK: ' + licenseBad.length);
      grunt.log.error('License NOT DEFINED: ' + licenseEmpty.length);
      grunt.log.error('Non-Bower Package: ' + noBowerJson.length);
    }

  });
};
