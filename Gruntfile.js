module.exports = function(grunt) {
    "use strict";

    var pkg = grunt.file.readJSON("package.json");
    grunt.initConfig({
        watch: {
            autoDeployUpdate: {
                files: [ "./src/**/*" ],
                tasks: [ "copy", "compress" ],
                options: {
                    debounceDelay: 250,
                    livereload: true
                }
            }
        },

        compress: {
            makezip: {
                options: {
                    archive: "./dist/" + pkg.version + "/" + pkg.name + ".mpk",
                    mode: "zip"
                },
                files: [ {
                    expand: true,
                    date: new Date(),
                    store: false,
                    cwd: "./src",
                    src: [ "**/*" ]
                } ]
            }
        },

        copy: {
            deployment: {
                files: [
                    { dest: "./test/Mx6.10/deployment/web/widgets", cwd: "./src/", src: [ "**/*" ], expand: true },
                    { dest: "./test/Mx7.23/deployment/web/widgets", cwd: "./src/", src: [ "**/*" ], expand: true },
                    { dest: "./test/Mx8.6/deployment/web/widgets", cwd: "./src/", src: [ "**/*" ], expand: true }
                ]
            },

            mpks: {
                files: [
                    { dest: "./test/Mx6.10/widgets", cwd: "./dist/" + pkg.version + "/", src: [ pkg.name + ".mpk" ], expand: true },
                    { dest: "./test/Mx7.23/widgets", cwd: "./dist/" + pkg.version + "/", src: [ pkg.name + ".mpk" ], expand: true },
                    { dest: "./test/Mx8.6/widgets", cwd: "./dist/" + pkg.version + "/", src: [ pkg.name + ".mpk" ], expand: true }
                ]
            }
        },

        clean: {
            build: [
                "./dist/" + pkg.version + "/" + pkg.name + "/*",
                "./test/*/deployment/web/widgets/" + pkg.name + "/*",
                "./test/*/widgets/" + pkg.name + ".mpk"
            ]
        },

        eslint: {
            options: { fix: true },
            target: [ "src/**/*.js", "Gruntfile.js" ]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-eslint");

    grunt.registerTask("default", [ "clean build", "watch" ]);
    grunt.registerTask(
            "clean build",
            "Compiles all the assets and copies the files to the build directory.", [ "clean", "compress", "copy" ]
            );
    grunt.registerTask("build", [ "clean build" ]);
};
