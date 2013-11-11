module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('grunt-aws.json'),

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            'public/<%= pkg.name %>.js',
            'public/<%= pkg.name %>.min.js',
            'public/stylesheets/*',
            'public/javascripts/*',
            'docs/*',
            'metrics/*'
          ]
        }]
      },
      server: '.tmp'
    },

    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      dist: {
        // the files to concatenate
        src: ['app/assets/bower_components/jquery/jquery.js', 'app/assets/javascripts/site/**/*.js'],
        // the location of the resulting JS file
        dest: 'public/javascripts/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/javascripts/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    // asset cache busting
    rev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      },
      assets: {
        files: [{
          src: [
            'img/**/*.{jpg,jpeg,gif,png}',
            'fonts/**/*.{eot,svg,ttf,woff}'
          ]
        }]
      }
    },

    jshint: {
      // define the files to lint
      files: ['gruntfile.js',
             'app/assets/javascripts/site/**/*.js',
             'app/assets/javascripts/tests/**/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/) - use a .jshintrc file
      options: {
        // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },

    // checks Javascript code quality
    plato: {
      default_options: {
        files: {
          'metrics/code_quality': ['app/assets/javascripts/site/**/*.js'],
        }
      },
    },

    // Not being used - left here as an example
    jasmine: {
      coverage: {
        src: ['app/assets/javascripts/site/*.js'],
        options: {
          specs: ['app/assets/javascripts/tests/*.js'],
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: 'metrics/coverage/coverage.json',
            report: 'metrics/coverage',
            thresholds: {
              lines: 75,
              statements: 75,
              branches: 75,
              functions: 90
            }
          }
        }
      }
    },

    // check for security vunerabilities
    retire: {
      js: ['app/assets/javascripts/site/*.js', 'app/assets/bower_components/**/*.js'], /** Which js-files to scan. **/
      options: {
         node: ['node_modules/'],
         verbose: true,
         packageOnly: true, /* Note! package:false is not yet implemented in grunt plugin, only in node version of retire. */
         jsRepository: 'https://raw.github.com/bekk/retire.js/master/repository/jsrepository.json',
         nodeRepository: 'https://raw.github.com/bekk/retire.js/master/repository/npmrepository.json'
      }
    },

    compass: {
      dist: {
        options: {
          sassDir: 'app/assets/stylesheets',
          cssDir: 'public/stylesheets',
          assetCacheBuster: true,
          environment: 'production'
        }
      },
      dev: {
        options: {
          sassDir: 'app/assets/stylesheets',
          cssDir: 'public/stylesheets',
          force: true,
          environment: 'development'
        }
      }
    },

    watch: {
      javascript: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint', 'concat']
      },
      css: {
        files: ['app/assets/stylesheets/**/*.scss'],
        tasks: ['compass:dev']
      }
    },

    // Javascript test runner
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    // Javascript documentation generator
    docco: {
      debug: {
        src: ['app/assets/javascripts/site/**/*.js'],
        options: {
          output: 'docs/javascripts'
        }
      }
    },

    // CSS styleguide generator
    styleguide: {
      dist: {
        files: {
          'docs/stylesheets': 'app/assets/stylesheets/*.scss'
        }
      }
    },

    // Send modified files to s3
    s3: {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        bucket: '<%= aws.bucket %>',
        access: 'public-read',
        headers: {
          // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
          "Cache-Control": "max-age=630720000, public",
          "Expires": new Date(Date.now() + 63072000000).toUTCString()
        }
      },
      dist: {
        // These options override the defaults
        options: {
          encodePaths: true,
          maxOperations: 20
        },
        // Files to be uploaded.
        sync: [
          {
            verify: true,
            src: 'public/stylesheets/*',
            dest: 'stylesheets',
            options: { gzip: true }
          },
          {
            verify: true,
            src: 'public/javascripts/*',
            dest: 'javascripts',
            options: { gzip: true }
          }
        ]
      }
    }

  });

  // Load in the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-code-quality-report');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-retire');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-styleguide');
  grunt.loadNpmTasks('grunt-s3');

  // install grunt dependencies task
  grunt.registerTask('install', [
    'install-dependencies'
  ]);

  // development task
  grunt.registerTask('dev', [
    'jshint',
    'compass:dev',
    'concat',
    'styleguide',
    'docco'
  ]);

  // register some tasks
  grunt.registerTask('test', [
    'clean:dist',
    'jshint',
    'plato',
    'karma'
  ]);

  // build task for production assets
  grunt.registerTask('prod', [
    'clean:dist',
    'compass:dist',
    'concat',
    'uglify',
    's3'
  ]);

  // the default task can be run just by typing "grunt" on the command line
  grunt.registerTask('default', [
    'clean:dist',
    'jshint',
    'concat',
    'uglify'
  ]);

};
