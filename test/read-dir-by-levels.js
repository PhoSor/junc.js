var fs = require('fs'),
    path = require('path'),
    async = require('../async');

function readDir(basePath, done) {
  var dirs = [], files = [], results = {};

  function readFile(fileName, done) {
    var filePath = path.join(basePath, fileName);

    fs.stat(filePath, function(error, stats) {
      var file = {path: filePath, type: ''};

      if (stats.isFile()) {
        file.type = 'regular';
        done(error, file);
      } else if (stats.isDirectory()) {
        file.type = 'directory';
        done(error, file);
      } else {
        file.type = 'other';
        done(error, file);
      }
    });
  }

  function filesRead(error, readFiles) {
    readFiles.forEach(function(file) {
      switch (file.type) {
        case 'regular':
          files.push(file);
          break;
        case 'directory':
          dirs.push(file);
          break;
      }
    });

    results = {dirs: dirs, files: files};
    done(error, results);
  }

  fileNames = fs.readdirSync(basePath);
  async.map(fileNames, readFile, filesRead);
}


function readFiles(basePath, done) {
  var openedDirs = 1, results = [];

  function dirRead(error, result) {
    results = results.concat(result.files);
    result.dirs.forEach(function(dir) {
      ++openedDirs;
      readDir(dir.path, dirRead);
    });
    --openedDirs;
    if (!openedDirs) done(error, results);
  }

  readDir(basePath, dirRead);
}

readFiles('./modules', function(error, files) {
  console.log(error, files);
});
