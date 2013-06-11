#!/usr/bin/env node

var async = require('./async'),
    fs = require('./fs'),
    Deps = require('./graph');

var configName = process.argv[2] || 'config.json',
    configs = fs.readJSON(configName),
    commentRegExp = /\/\*\*[\s\S]*?\*\//,
    requireRegExp = /@require[\s]*([\S]+)/g,
    extRegExp = /\.js$/,
    ext = '.js', outputs = [],
    fileCache = {};


/**
 * Помощник. Возвращает RegExp из строки.
 */
function regexp(pattern) {
  return new RegExp(pattern);
}


/**
 * Нормализует поле фильтруемых и откляняемых файлов в конфигурации.
 */
configs.forEach(function(config) {
  outputs.push(config.output);

  config.filter = (config.filter || []).map(regexp);
  config.reject = (config.reject || []).map(regexp);
});


/**
 * Основная работа для каждой конфигурции.
 */
configs.forEach(function(config) {
  /** Общие настройки фильтруемых и откланяемых файлов. */
  var options = {
    filter: config.filter.concat([extRegExp]),
    reject: config.reject
  };

  /** Помощник. Расширяет имя файла до его полного пути. */
  function name2path(name) {
    return fs.join(config.basePath, name + ext);
  }

  /** Помощник. Читает файл и возвращает объект
   * с именем файла и его содержимым. */
  function readFile(filePath, done) {
    fs.readFile(filePath, function(error, data) {
      done(error, {path: filePath, content: data});
    });
  }

  /** Читает статус файлов с применением фильтров. */
  fs.readStats(config.basePath, options, function(error, files) {
    var output, outputFilePath = '', resolved = [], deps = new Deps;

    // console.log(error, files);
    /* files.forEach(function(file) {
      var comment, provide, require, requires = [];

      comment = file.content.match(commentRegExp);
      if (comment) {
        comment = comment[0];

        require = requireRegExp.exec(comment);
        while (require) {
          require = name2path(require[1]);
          requires.push(require);
          require = requireRegExp.exec(comment);
        }
        // console.log(file.path, requires);
      }
      deps.add(file.path, requires);
      // provides[file.path] = file;
    }); */

    resolved = deps.getResolved(name2path(config.entry));

    output = fs.createWriteStream(fs.join(config.basePath, config.output));
    async.map(resolved, readFile, function(error, files) {
      var filesContent = {};
      // console.log(resolved, files);

      files.forEach(function(file) {
        filesContent[file.path] = file.content;
      });
      resolved.forEach(function(filePath) {
        output.write(filesContent[filePath]);
      });
      output.end();
      console.log(config.output, resolved);
    });

    /* resolved.forEach(function(provideName) {
      fileContent = provides[provideName].content;
      output.write(fileContent);
    }); */
  });
});

