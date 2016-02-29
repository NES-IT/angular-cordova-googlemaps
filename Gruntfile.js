module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            dist: {
                files: {
                    'dist/nes.googlemaps.min.js': ['src/googleMaps.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify'); // load the given tasks
    grunt.registerTask('default', ['uglify']); // Default grunt tasks maps to grunt
};