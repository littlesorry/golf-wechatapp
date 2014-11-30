'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    mochaTest : {
      test : {
        options : {
          reporter : 'spec'
        },
        src : [ 'test/**/*Test.js' ]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', [ 'mochaTest:test' ]);

  // Default task.
  grunt.registerTask('default', [ 'test' ]);

};
