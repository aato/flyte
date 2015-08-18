module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');
  var name = 'dist/' + pkg.name + "-" + pkg.version + ".js";
  var minName = 'dist/' + pkg.name + "-" + pkg.version + ".min.js";

  var files = {};
  files['dist/' + pkg.name + "-" + pkg.version + ".js"] = ["src/main.js"];

  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        options: {
          transform: [["babelify", { "stage": 0 }]]
        },
        files : files
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      dist: {
        src: ['dist/' + pkg.name + "-" + pkg.version + ".js"],
        dest: 'dist/' + pkg.name + "-" + pkg.version + ".min.js"
      }
    },
    watch: {
      scripts: {
        files: "src/**/*.js",
        tasks: ["browserify"]
      }
    },
    concat: {
      options: {
        separator: grunt.util.linefeed
      },
      dist: {
        src: ['lib/browser-polyfill.min.js', 'lib/request-frame.min.js', 'dist/' + pkg.name + "-" + pkg.version + ".js"],
        dest: 'dist/' + pkg.name + "-" + pkg.version + ".js",
      },
    },
    usebanner: {
      taskName: {
        options: {
          position: 'top',
          banner: '/**\n * <%= pkg.name %> - Object model for the HTML5 canvas - a lightweight, faster alternative to fabric.js\n * @version v<%= pkg.version %>\n * @license MIT\n * @date <%= grunt.template.today("yyyy-mm-dd") %>\n * @preserve\n * Copyright (c) Alex Alksne <alex.alksne@gmail.com> 2015 All Rights Reserved.\n */',
          linebreak: true
        },
        files: {
          src: 'dist/' + pkg.name + "-" + pkg.version + ".js"
        }
      }
    },
    clean: ["dist/"]
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks("grunt-banner");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");

  grunt.registerTask("default", ["clean", "browserify", "usebanner", "concat", "uglify"]);
};
