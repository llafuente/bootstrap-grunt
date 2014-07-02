# bootstrap-grunt

![NPM](https://nodei.co/npm/bootstrap-grunt.png?compact=true)


## Introduction

Grunfile.js is not reusable. bootstrap-grunt help you to organize your Gruntfile, splitting it in small files.


# Example Guntfile.js

```js

module.exports = function (grunt) {

    var path = require("path"),
        bootstrap = require("bootstrap-grunt");

    bootstrap(grunt)
        // --------------
        // Initial configuration
        .setConfig({
            banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n */\n',
            src: {
                docs: "<%= pkg.directories.docs %>",
                css: "<%= pkg.directories.source.css %>",
                js: "<%= pkg.directories.source.js %>",
                specs: "<%= pkg.directories.test.casperjs %>",
                html: "<%= pkg.directories.source.html %>"
            }
        })

        // load package.json and store it's contents in <configuration>.pkg
        // loadPackageJSON(String absolute_path)
        .loadPackageJSON(path.join(__dirname , 'package.json'))

        // if you need to do something with the configuration before loading dependencies
        // config(Function callback(Object config, Object package_json))
        .config(function(config, package_json) {
            package_json.directories.source.js =
                bootstrap.expandFiles(package_json.directories.source.js);
        })

        // --------------
        // loading your plugins

        // from package.json -> .devDependencies load all grunt-*
        .loadDevDependencies()

        // from package.json -> .dependencies load all grunt-*
        .loadDependencies()

        // alternative method: .config(function(){ require('load-grunt-tasks')(grunt); })

        // --------------
        // Loading your configuration/tasks
        // loadConfiguration(Array from, Object options);

        // *.js are required and execute it
        // Arguments passed: grunt, config, bootstrap

        // *.json are treated as configuration extensors
        // *.yml are treated as configuration extensors

        // options has only "json_comments" atm.
        .loadConfiguration([path.join(__dirname , 'grunt/*')], {json_comments: true})

        // init Grunt
        .initConfig();
    // RIP Gruntfile.js
};

```



## license


MIT.
