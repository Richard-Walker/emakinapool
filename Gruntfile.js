/*global module:false*/
module.exports = function(grunt) {

  var Settings = require('./src/js/settings.' + (grunt.option('env') || 'test') + '.js');

  grunt.initConfig({
    
    // Metadata

    pkg: grunt.file.readJSON('package.json'),
    
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= pkg.license %> */\n\n',
    
    pagePath: 'display/activities/Pool+League',
    
    assetsPageId: Settings.badgesPageId,
    scriptsPageId: Settings.scriptsPageId,

    // Tasks config

    shell: {
      refreshDist: {
        command: './getdist.sh <%= pagePath %>'
      },
      rebuildDist: {
        command: './getdist.sh -r <%= pagePath %>'
      }
    },
    
    clean: {
      dist: ['dist']
    },
    
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      js: {
        src: [
          'src/js/**/*.js',
          '!src/js/settings.js', '!src/js/settings.*.js', 'src/js/settings.' + Settings.environment + '.js',
          '!src/js/main.js', 'src/js/main.js'
        ],
        dest: 'dist/download/attachments/<%= scriptsPageId %>/<%= pkg.name %>.js'
      },
    },
    
    jst: {
      options: { 
        prettify: true,
        processName: function(path) {
          return path.split('/').pop().replace('.html','');
        },
      },
      views: {
        src: ['src/jst/*.html'],
        dest: 'dist/download/attachments/<%= scriptsPageId %>/templates.js'
      },
      emails: {
        options: {
          templateSettings: {
            interpolate: /\{\{ (.+?) \}\}/g,
            evaluate: /\{\{\! (.+?) \}\}/g,
            escape: /\{\{\- (.+?) \}\}/g
          }
        },
        src: ['dist/emails/*.html'],
        dest: 'dist/download/attachments/<%= scriptsPageId %>/email-templates.js'
      }
    },

    inlinecss: {
      options: {
        applyStyleTags: true,
        removeStyleTags: true
      },
      emails: {  
        expand: true,
        cwd: 'src/jst/emails/',
        src: '*.html',
        dest: 'dist/emails/'
      }
    },

    copy: {
      img: {
        expand: true,
        cwd: 'src/img/',
        src: '*.{png,jpeg,jpg,gif,svg}',
        dest: 'dist/download/attachments/<%= assetsPageId %>/'
      },
      img_css: {
        expand: true,
        cwd: 'src/css/',
        src: '*.{png,jpeg,jpg,gif,svg}',
        dest: 'dist/download/attachments/<%= scriptsPageId %>/'        
      }
    },

    less: {
      main: {
        src: 'src/css/emakinapool.less',
        dest: 'dist/download/attachments/<%= scriptsPageId %>/emakinapool.css'
      },
      emails: {
        src: 'src/css/emails.less',
        dest: 'dist/emails/emails.css'
      }
    },

    jshint: {
      options: {
        asi: true, curly: true, eqeqeq: true, immed: true, latedef: true, newcap: true,
        noarg: true, sub: true, undef: true, unused: true, boss: true, eqnull: true, jquery: true, node: true,
        globals: { EP: true, _: true, Confluence: true, AJS: true, JST: true, location: true, history: true, window: true }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      js: {
        src: 'src/js/**/*.js'
      }
    },

    confluence_attachments: {
      options: {
        baseUrl: 'https://share.emakina.net',
      },
      assets: {
        options: {
          pageId: '<%= assetsPageId %>'
        },
        src: ['dist/download/attachments/<%= assetsPageId %>/*', '!*.orig']
      },
      scripts: {
        options: {
          pageId: '<%= scriptsPageId %>'
        },
        src: ['dist/download/attachments/<%= scriptsPageId %>/*', '!*.orig'],
      }
    },

    // WATHCERS

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: 'src/js/**/*.js',
        tasks: ['newer:jshint:js','concat:js']
      },
      less_main: {
        files: ['src/css/emakinapool.less', 'src/css/palette.less'],
        tasks: ['less:main']
      },
      less_emails: {
        files: ['src/css/emails.less', 'src/css/palette.less'],
        tasks: ['less:emails','inlinecss:emails','jst:emails']
      },
      jst_views: {
        files: ['src/jst/*.html'],
        tasks: ['jst:views']
      },
      jst_emails: {
        files: ['src/jst/emails/*.html'],
        tasks: ['less:emails','newer:inlinecss:emails','jst:emails']
      },
      img: {
        files: ['src/img/*.{png,jpeg,jpg,gif,svg}', 'src/css/*.{png,jpeg,jpg,gif,svg}'],
        tasks: ['newer:copy']
      },
      dist: {
        files: ['dist/download/attachments/{<%= assetsPageId %>,<%= scriptsPageId %>}/*','!*.orig'],
        tasks: ['newer:confluence_attachments']
      }
    },

    concurrent: {
      options: {
        limit: 10,
        logConcurrentOutput: true
      },
      watch_src: ['watch:gruntfile', 'watch:js', 'watch:less_main', 'watch:less_emails', 'watch:jst_views', 'watch:jst_emails', 'watch:img']
    }
  });

  // Plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-http-upload');
  grunt.loadNpmTasks('grunt-confluence-attachments');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-inline-css');
  //grunt.loadNpmTasks('grunt-inline');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Project tasks
  grunt.registerTask('build', ['newer:jshint','newer:concat','newer:less','newer:inlinecss','newer:jst','newer:copy']);  // Build light (skip unchanged files)
  grunt.registerTask('build!', ['jshint','concat','less','inlinecss','inline','jst','copy']);         // Build all
  grunt.registerTask('publish', ['newer:confluence_attachments']);        // Upload to Share (skip unchanged files) 
  grunt.registerTask('get', ['shell:refreshDist']);                       // Refresh dist folder from Share (html and dependencies) 
  grunt.registerTask('get!', ['shell:rebuildDist']);                      // Rebuild the entire dist folder from Share

  // 'Deamon' tasks
  grunt.registerTask('default', ['build','concurrent:watch_src']);        // Work locally
  grunt.registerTask('remote', ['build','publish','watch']);              // Work locally and automatically upload changes to Share

};
