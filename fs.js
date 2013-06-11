var fs = require('fs'),
    path = require('path'),
    async = require('./async');


function readDir(basePath, options, done) {

  function readFile(fileName, done) {
    var filePath = path.join(basePath, fileName);

    fs.stat(filePath, function(error, stats) {
      if (stats.isDirectory()) {
        readDir(filePath, options, done);
      } else if (stats.isFile()) {
        var i, pattern,
            file = {path: filePath, content: '', mtime: stats.mtime};

        for (i = 0; i < options.filter.length; i++) {
          pattern = options.filter[i];
          if (!filePath.match(pattern)) {
            done(error, null);
            return;
          }
        }

        for (i = 0; i < options.reject.length; i++) {
          pattern = options.reject[i];
          if (filePath.match(pattern)) {
            done(error, null);
            return;
          }
        }

        /* fs.readFile(filePath, {encoding: 'utf8'}, function(error, content) {
          if (error) done(error, null);

          var file = {path: filePath, content: content};

          done(error, file);
        }); */
        done(error, file);
      }
    });
  }

  function filesRead(error, readFiles) {
    done(error, readFiles);
  }

  fileNames = fs.readdirSync(basePath);
  async.map(fileNames, readFile, filesRead);
}


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


fs.readStats = function(basePath, options, done) {
  readDir(basePath, options, function(error, files) {
    var results = flatten(files);

    results = results.filter(function(file) {
      return file;
    });

    done(error, results);
  });
};


fs.readJSON = function(filePath) {
  var json, fileContent = fs.readFileSync(filePath, {encoding: 'utf8'});

  json = JSON.parse(fileContent);

  return json;
};


fs.join = path.join;


module.exports = fs;
