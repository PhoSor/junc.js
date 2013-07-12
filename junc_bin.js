var path = require('path'),
    async = require('./async'),
    fs = require('./fs'),
    _ = require('./underscore');

var configName = process.argv[2] || 'config.json',
    configs = fs.readJSON(configName),
    commentRegExp = /\/\*\*[\s\S]*?\*\//,
    requireRegExp = /@require[\s]*([\S]+)/g,
    ext = '.js';


/**
 * Основная работа для каждой конфигурции.
 */
configs.forEach(function(config) {
  var outputModified, configPath = path.dirname(configName),
      outputFilePath = path.join(configPath, config.basePath, config.output);

  config.defaultModules = config.defaultModules || [];

  /** Помощник. Расширяет имя файла до его полного пути. */
  function name2path(name) {
    return path.join(configPath, config.basePath, name + ext);
  }

  function getRequires(text) {
    var comment, require, requires = [];

    comment = text.match(commentRegExp);
    if (comment) {
      comment = comment[0];

      require = requireRegExp.exec(comment);
      while (require) {
        requires.push(require[1]);
        require = requireRegExp.exec(comment);
      }
    }

    return requires;
  }

  function readFile(name, done) {
    var filePath = name2path(name), stat = fs.statSync(filePath),
        file = {path: filePath, mtime: stat.mtime};

    fs.readFile(filePath, function(error, data) {
      if (error) throw error;

      var requires = [], text = data.toString();

      file.content = data;
      requires = getRequires(text);
      if (requires.length) {
        async.map(requires, readFile, function(error, files) {
          files.push(file);
          done(error, files);
        });
      } else {
        done(error, file);
      }
    });
  }

  if (fs.existsSync(outputFilePath)) {
    outputModified = fs.statSync(outputFilePath).mtime;
  } else {
    outputModified = 0;
  }

  async.parallel({
    defaultModules: function(done) {
      async.map(config.defaultModules, readFile, done);
    },
    requireModules: function(done) {
      async.map([config.entry], readFile, done);
    }
  }, function(error, results) {
    var modified = false, seen = [], files = [];

    files = results.defaultModules.concat(_.flatten(results.requireModules));
    modified = files.some(function(file) {
      return file.mtime > outputModified;
    });

    if (modified) {
      output = fs.createWriteStream(outputFilePath);
      files.forEach(function(file) {
        if (seen.indexOf(file.path) < 0) {
          output.write(file.content);
          seen.push(file.path);
        }
      });
      output.end();
      console.log(config.output, seen);
    } else {
      console.log(config.output, 'not modified.', seen);
    }
  });
});

