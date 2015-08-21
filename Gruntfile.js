/*global module:false*/
module.exports = function(grunt) {

  grunt.initConfig({
    
    // Metadata
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= pkg.license %> */\n\n',
    pagePath: 'display/activities/Pool+Championship+-+V2',
    assetsPageId: '102665363',
    scriptsPageId: '104693790',

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
        src: ['src/js/**/*.js', '!src/js/main.js', 'src/js/main.js'],
        dest: 'dist/download/attachments/<%= scriptsPageId %>/<%= pkg.name %>.js'
      },
    },
    jst: {
      options: { 
        prettify: true,
        processName: function(path) {
          return path.split('/').pop().replace('.html','').replace('.inlined','');
        }
      },
      compile: {
        src: ['src/jst/*.html', '!src/js/*Mail.html', 'src/jst/inlined/*.html'],
        dest: 'dist/download/attachments/<%= scriptsPageId %>/templates.js'
      }
    },
    inlinecss: {
      options: {

      },
      emails: {
        src: ['src/js/*Mail.html'],
        dest: 'src/jst/inlined/'
      }
    }
    copy: {
      img: {
        expand: true,
        cwd: 'src/img/',
        src: '*.{png,jpeg,jpg,gif,svg}',
        dest: 'dist/download/attachments/<%= assetsPageId %>/'
      },
      css: {
        expand: true,
        cwd: 'src/css/',
        src: '*',
        dest: 'dist/download/attachments/<%= scriptsPageId %>/'
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
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: 'src/js/**/*.js',
        tasks: ['newer:jshint:js','concat:js']
      },
      jst: {
        files: 'src/jst/*.html', '!src/js/*Mail.html', 'src/jst/inlined/*.html',
        tasks: ['jst']
      },
      inlinecss: {
        files: 'src/jst/*Mail.html',
        tasks: ['inlinecss']
      },
      css: {
        files: 'src/css/*',
        tasks: ['newer:copy:css']
      },
      img: {
        files: 'src/img/*.{png,jpeg,jpg,gif,svg}',
        tasks: ['newer:copy:img']
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
      watch_src: ['watch:gruntfile', 'watch:js', 'watch:jst', 'watch:inlinecss', 'watch:css', 'watch:img']
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

  // Project tasks
  grunt.registerTask('build', ['newer:jshint','newer:concat','newer:inlinecss','newer:jst','newer:copy']);  // Build light (skip unchanged files)
  grunt.registerTask('build!', ['jshint','concat','inlinecss','jst','copy']);         // Build all
  grunt.registerTask('publish', ['newer:confluence_attachments']);        // Upload to Share (skip unchanged files) 
  grunt.registerTask('get', ['shell:refreshDist']);                       // Refresh dist folder from Share (html and dependencies) 
  grunt.registerTask('get!', ['shell:rebuildDist']);                      // Rebuild the entire dist folder from Share

  // 'Deamon' tasks
  grunt.registerTask('default', ['build','concurrent:watch_src']);        // Work locally
  grunt.registerTask('remote', ['build','publish','watch']);              // Work locally and automatically upload changes to Share

};
