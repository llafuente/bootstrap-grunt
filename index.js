var grunt,
    package_json,
    config;

module.exports = function (_grunt) {
    grunt = _grunt;

    return module.exports;
};

module.exports.setConfig = function (_config) {
    config = _config;

    return this;
};

module.exports.loadPackageJSON = function (absolute_path) {
    if (!config) {
        throw new Error("setConfig first");
    }

    package_json = grunt.file.readJSON(absolute_path);
    config.pkg = package_json;

    return this;
};

function loadDeps(json) {
    var pkg;
    for (pkg in json) {
        if (pkg.indexOf("grunt-") === 0) {
            grunt.loadNpmTasks(pkg);
        }
    }
}

module.exports.loadDevDependencies = function () {
    if (!package_json) {
        throw new Error("loadPackageJSON first");
    }

    loadDeps(package_json.devDependencies);

    return this;
};

module.exports.loadDependencies = function () {
    if (!package_json) {
        throw new Error("loadPackageJSON first");
    }

    loadDeps(package_json.dependencies);

    return this;
};

module.exports.expandFiles = function (_arr) {
    var arr = _arr.slice();
    arr.unshift({
        filter: function (f) {
            return grunt.file.isFile(f);
        }
    });

    return grunt.file.expand.apply(null, arr);
};

module.exports.loadConfiguration = function (from, cfg) {
    var self = this;

    this
    .expandFiles(from)
    .forEach(function (file) {
        var f = file.split(".");

        switch (f[f.length - 1]) {
            case "json":
                var json;
                if (cfg.json_comments) {
                    json = grunt.file.read(file).split("\n").map(function (str) {
                        if (str.match(/\s+\/\/.*/g)) {
                            return "";
                        }
                        return str;
                    });

                    try {
                        json = JSON.parse(json.join("\n"));

                        self.merge(json);
                    } catch (e) {
                        grunt.log.error("parsing error at " + file);
                        grunt.log.error(e);
                    }
                } else {
                    self.merge(grunt.file.readJSON(file));
                }

                break;
            case "js":
                grunt.verbose.writeln("Reading", file);
                require(file)(grunt, config, self);
                break;
            case "yml":
                self.merge(grunt.file.readYAML(file));
                break;
        }
    });

    return this;
};

module.exports.config = function (callback) {
    if (!config) {
        throw new Error("setConfig first");
    }

    callback && callback(config, package_json);

    return this;
};

module.exports.alias = function (aliases) {
    var al;

    for (al in aliases) {
        grunt.registerTask(al, aliases[al][0], aliases[al][1]);
    }
};


module.exports.initConfig = function () {
    grunt.verbose.writeln(">> ".green, "grunt.initConfig");

    grunt.initConfig(config);

    return this;
};

module.exports.merge = function (cfg) {
    grunt.util._.merge(config, cfg);

    return this;
};
