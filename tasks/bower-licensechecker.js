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
    var o = this.options() || {};

    if( !o.directory && grunt.file.isFile( '.bowerrc' ) ){
      o.directory = grunt.file.readJSON('.bowerrc').directory;
    }

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
        if(license.indexOf(acceptableList[i]) !== -1){
          return true;
        }
      }
      return false;
    },

    fillArr = function(arr, obj){
      arr.push( obj );
    },

    getLicense = function(dir){
      var libLicense,
          packageName = String(dir).replace(bowerDir, ''),
          obj = { package: packageName, dir: dir, license: null};

      try{
        // Has bower.json so the assumption is it's Bower Component
        libLicense = grunt.file.readJSON(dir + '/bower.json').license;
        obj.license = libLicense;

        if(typeof libLicense === 'undefined'){
          // No License
          fillArr( licenseEmpty, obj );
          // displayMessage('No License @ ' + packageName);

        }else if(typeof libLicense === 'string'){
          // Singe license
          return ( compareAcceptable(libLicense) ) ? fillArr( licenseGood, obj ) : fillArr( licenseBad, obj );

        }else if(libLicense instanceof Array){
          // Multiple licenses
          for( var i in libLicense ) {
            return ( compareAcceptable(libLicense[i]) ) ? fillArr( licenseGood, obj ) : fillArr( licenseBad, obj );
          }
        }
      }catch(e){
        // Non-Bower Component
        fillArr( noBowerJson, obj );
        // displayMessage('Bower.json not found @ ' + packageName);
      }
    },

    displayMessage = function(msg, opt){
      var o = opt || {error: true};
      if(o.error){
        grunt.log.error(msg);
      } else {
        grunt.log.ok(msg);
      }
    },

    printWarn = function(arr){
      for( var i in arr ) {
        displayMessage(arr[i].package + (arr[i].license ? ' > ':'') + (arr[i].license || '') );
      }
    };




    if(!grunt.file.isDir(bowerDir)){
      grunt.fail.warn('Please make sure you have right path to bower components folder.');
    }
    grunt.file.expand(bowerDir + '*').forEach( getLicense );




    if (licenseBad.length < 1 && licenseEmpty.length < 1 && noBowerJson.length < 1) {
      displayMessage('All GOOD!', {error: false});
    }else{
      if(o.log && o.log.warn){
        if(noBowerJson.length > 0 && (o.log && o.log.printNonBower)){
          grunt.log.writeln('');
          grunt.log.writeln('=== [ NON-BOWER ] ===');
          printWarn(noBowerJson);
        }
        if(licenseEmpty.length > 0 && (o.log && o.log.printNoLicense)){
          grunt.log.writeln('');
          grunt.log.writeln('=== [ NO LICENSE ] ===');
          printWarn(licenseEmpty);
        }
        if(licenseBad.length > 0){
          grunt.log.writeln('');
          grunt.log.writeln('=== [ LICENSE NOT OK ] ===');
          printWarn(licenseBad);
        }
      } else {
        displayMessage('Some Licenses are NOT OK!', {error: true});
      }
    }

    if(o.log && o.log.printTotal){
      grunt.log.writeln('');
      grunt.log.writeln('=== [ TOTALS ] ===');
      displayMessage('Licenses OK: ' + licenseGood.length, {error: false});
      displayMessage('License NOT OK: ' + licenseBad.length);
      displayMessage('License NOT DEFINED: ' + licenseEmpty.length);
      displayMessage('Non-Bower Package: ' + noBowerJson.length);
    }

  });
};
