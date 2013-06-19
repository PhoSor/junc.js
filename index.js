#!/usr/bin/env node

var async = require('./async'),
    fs = require('./fs');
    // Deps = require('./graph');

var configName = process.argv[2] || 'config.json',
    configs = fs.readJSON(configName),
    commentRegExp = /\/\*\*[\s\S]*?\*\//,
    requireRegExp = /@require[\s]*([\S]+)/g,
    ext = '.js',
    // outputs = [],
    fileCache = {};


/**
 * Помощник. Возвращает RegExp из строки.
 */
// function regexp(pattern) {
  // return new RegExp(pattern);
// }


/**
 * Нормализует поле фильтруемых и откляняемых файлов в конфигурации.
 */
// configs.forEach(function(config) {
  // outputs.push(config.output);

  // config.filter = (config.filter || []).map(regexp);
  // config.reject = (config.reject || []).map(regexp);
// });


function flatten(array, results) {
  var results = results || [];

  array.forEach(function(item) {
    if (item instanceof Array) {
      flatten(item, results);
    } else {
      results.push(item);
    }
  });

  return results;
}


/**
 * Основная работа для каждой конфигурции.
 */
configs.forEach(function(config) {
  // [>* Общие настройки фильтруемых и откланяемых файлов. <]
  // var options = {
    // filter: config.filter.concat([extRegExp]),
    // reject: config.reject
  // };
  var outputModified, outputFilePath = fs.join(config.basePath, config.output);

  /** Помощник. Расширяет имя файла до его полного пути. */
  function name2path(name) {
    return fs.join(config.basePath, name + ext);
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

  /* function fromCache(file) {
    var result;

    if (file.path && file.mtime) {
      result = fileCache[file.path];
      console.log('from:', result, file.path);
      if (!result || (result.mtime < file.mtime)) {
        result = file;
      }
    }

    return result;
  }

  function toCache(file) {
    if (file.mtime && file.path) {
      fileCache[file.path] = file;
      console.log('to:', file.mtime, file.path);
    }
  } */

  function readFile(name, done) {
    var filePath = name2path(name), stat = fs.statSync(filePath),
        file = {path: filePath, mtime: stat.mtime};

    // file = fromCache(file);
    // if (file.content) {
      // done(null, file);
    // } else {

    fs.readFile(filePath, function(error, data) {
      if (error) throw error;

      var requires = [], text = data.toString();

      file.content = data;
      // toCache(file);
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
    // }
  }

  if (fs.existsSync(outputFilePath)) {
    outputModified = fs.statSync(outputFilePath).mtime;
  } else {
    outputModified = 0;
  }

  async.map([config.entry], readFile, function(error, files) {
    var modified = false, seen = [];

    files = flatten(files);
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

  /** Помощник. Читает файл и возвращает объект
   * с именем файла и его содержимым. */
  // function readFile(filePath, done) {
    // fs.readFile(filePath, function(error, data) {
      // done(error, {path: filePath, content: data});
    // });
  // }

  /** Читает статус файлов с применением фильтров. */
  // fs.readStats(config.basePath, options, function(error, files) {
    // var output, outputFilePath = '', resolved = [], deps = new Deps;

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

    // resolved = deps.getResolved(name2path(config.entry));

    // output = fs.createWriteStream(fs.join(config.basePath, config.output));
    // async.map(resolved, readFile, function(error, files) {
      // var filesContent = {};
      // // console.log(resolved, files);

      // files.forEach(function(file) {
        // filesContent[file.path] = file.content;
      // });
      // resolved.forEach(function(filePath) {
        // output.write(filesContent[filePath]);
      // });
      // output.end();
      // console.log(config.output, resolved);
    // });

    /* resolved.forEach(function(provideName) {
      fileContent = provides[provideName].content;
      output.write(fileContent);
    }); */
  // });
});

