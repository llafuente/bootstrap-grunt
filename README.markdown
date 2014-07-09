# bootstrap-grunt

![NPM](https://nodei.co/npm/bootstrap-grunt.png?compact=true)


## Introduction

bootstrap-grunt helps you to configure Grunt in a maintainable way.

Gruntfile grows out of control easily. bootstrap-grunt breaks up Gruntfile into many small-reusable tasks & config files.


# Gruntfile.js

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

        // load package.json and store its contents in <configuration>.pkg
        // loadPackageJSON(String absolute_path)
        .loadPackageJSON(path.join(__dirname , 'package.json'))

        // if you need to do something with the configuration before loading dependencies
        // config(Function callback(Object config, Object package_json))
        .config(function(config, pkg_json) {
            //only files
            pkg_json.directories.js =
                bootstrap.expandFiles(pkg_json.directories.js);
        })

        // --------------
        // loading your plugins

        // from package.json -> .devDependencies load all grunt-*
        // note: loadPackageJSON must be called before
        .loadDevDependencies()

        // from package.json -> .dependencies load all grunt-*
        // note: loadPackageJSON must be called before
        .loadDependencies()

        // alternative method: .config(function(){ require('load-grunt-tasks')(grunt); })

        // --------------
        // Loading your configuration/tasks
        // loadConfiguration(Array from, Object options);
        // options
        // * json_comments: Boolean support comments in the JSON, remove every line that match "\s*//"

        // *.js are required and execute it
        // Arguments passed: grunt, config, bootstrap

        // *.json are treated as config extensors
        // *.yml are treated as config extensors

        .loadConfiguration([path.join(__dirname , 'grunt/*')], {json_comments: true})

        // init Grunt
        .initConfig();
    // RIP Gruntfile.js
};

```

# task: grunt/print.js

```js

module.exports = function(grunt, config, bootstrap) {
    // set configuration or use YML/JSON instead your choice!
    bootstrap.merge({
        print: {
            es: { options: { lang: "Hola!"}},
            en: { options: { lang: "Hello!"}},
        }
    });

    // register tasks normally
    grunt.registerMultiTask('print', 'Increment HTML version', function () {
        var options;

        switch(this.target) {
            case "es":
                options = this.options({ lang: "Adios!"});
                break;
            case "en":
                var options = this.options({ lang: "Bye!"});
                break;
        }

        grunt.log.debug("In config: ", config.print[this.target].options.lang);
        grunt.log.debug("In options: ", options.lang);
    });
};

```

# config: grunt/print.yml

An alternative to bootstrap.merge

```yml
print:
    es:
        options:
            lang: "Hola!"
    en:
        options:
            lang: "Hello!"

```


# config: grunt/cssmin.json

```json
{
    "cssmin": {
        "dist": {
            "expand": true,
            "cwd": "public/css/",
            "src": ["*.css", "!*.min.css"],
            "dest": "public/css/",
            "ext": ".min.css"
        }
    }
}
```

## bootstrap helpers

#### `setConfig`(Object _config)

Set initial config

#### `config`(Function callack(Object config, Object package_json))

Do something with the config at given point.

#### `loadPackageJSON`(String absolute_path)

Load (sync) package.json and store its contents in config.pkg

#### `loadDevDependencies`()

Load dependencies from read package.json configuration `devDependencies` that starts with `grunt-`

#### `loadDependencies`()

Load dependencies from read package.json configuration `dependencies` that starts with `grunt-`

#### `loadConfiguration`(Array from, Object cfg)

Load Task & config from given globbing patterns (from).

`cfg`

* json_comments: Boolean

  Support comments in the JSON, remove every line that match "\s*//"

#### `expandFiles`(Array _arr)

Expand files only.

#### `merge` (Object)

Merge given object into current configuration

#### `initConfig`()

Call grunt.initConfig


## license


MIT.
