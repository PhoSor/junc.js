var fs = require('fs'),
    path = require('path'),
    async = require('../async');

function readDir(basePath, done) {

  function readFile(fileName, done) {
    var filePath = path.join(basePath, fileName);

    fs.stat(filePath, function(error, stats) {
      var file = {path: filePath, type: ''};

      if (stats.isDirectory()) {
        readDir(file.path, done);
      } else if (stats.isFile()) {
        fs.readFile(filePath, {encoding: 'utf8'}, function(error, content) {
          if (error) done(error, file);

          file.content = content;
          done(error, file);
        });
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

function readFiles(basePath, done) {
  readDir(basePath, function(error, files) {
    var results = flatten(files);

    done(error, files);
  });
}

module.exports.readFiles = readFiles;
