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
    attachmentsPageId: '102665363',

    // Tasks config
    shell: {
      getdist: {
        command: './getdist.sh <%= pagePath %>'
      }
    },
    clean: {
      dist: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      js: {
        src: 'src/js/*.js',
        dest: 'dist/download/attachments/<%= attachmentsPageId %>/<%= pkg.name %>.js'
      },
    },
    jst: {
      options: { 
        prettify: true,
        processName: function(path) {
          return path.split('/').pop().replace('.html','');
        }
      },
      compile: {
        src: 'src/jst/*.html',
        dest: 'dist/download/attachments/<%= attachmentsPageId %>/templates.js'
      }
    },
    copy: {
      img: {
        expand: true,
        cwd: 'src/img/',
        src: '*.{png,jpeg,jpg,gif,svg}',
        dest: 'dist/download/attachments/<%= attachmentsPageId %>/'
      },
      css: {
        expand: true,
        cwd: 'src/css/',
        src: '*.css',
        dest: 'dist/download/attachments/<%= attachmentsPageId %>/'
      }
    },
    jshint: {
      options: {
        asi: true, curly: true, eqeqeq: true, immed: true, latedef: true, newcap: true,
        noarg: true, sub: true, undef: true, unused: true, boss: true, eqnull: true, jquery: true,
        globals: { EP: true, _: true, AJS: true }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      js: {
        src: 'src/js/*.js'
      }
    },
    http_upload: {
      test: {
        options: {
          url: 'https://rwa:Trustevery1@share.emakina.net/rest/api/content/<%= attachmentsPageId %>/child/attachment/att102665367/data',
          method: 'POST',
          rejectUnauthorized: false,
          headers: {
            //'Authorization': 'Token <%= your_token_here %>',
            'X-Atlassian-Token': 'nocheck'
          },
          data: {
            comment: 'some other comment',
            minorEdit: false
          },
          onComplete: function(data) {
              console.log('Response: ' + data);
          }
        },
        // src: 'dist/download/attachments/<%= attachmentsPageId %>/badge_Apprentice.png',
        src: 'badge_Test.png',
        dest: 'file'
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: 'src/js/*.js',
        tasks: ['newer:jshint:js','concat:js']
      },
      jst: {
        files: 'src/jst/*.html',
        tasks: ['jst']
      },
      css: {
        files: 'src/css/*.css',
        tasks: ['newer:copy:css']
      },
      img: {
        files: 'src/img/*.{png,jpeg,jpg,gif,svg}',
        tasks: ['newer:copy:img']
      }
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
  
  // Project tasks
  grunt.registerTask('default', ['newer:jshint','concat','jst','newer:copy','watch']);
  grunt.registerTask('build', ['newer','concat','jst','copy']);
  grunt.registerTask('get', ['shell:getdist']);
  grunt.registerTask('publish', []);

};
