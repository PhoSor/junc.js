#!/usr/bin/env node

var fs = require('fs'),
    path = require('path');

var base = '', basePath = process.argv[2] || '.',
    outputFile = 'files.js';

function readDir(basePath, finish) {
  var files = [], fileNames = fs.readdirSync(basePath);

  function done(error, file) {
    if (error) { return done(error, files); }

    files.push(file);
    if (files.length == fileNames.length) { finish(error, files); }
  }

  fileNames.forEach(function(fileName) {
    var filePath = path.join(basePath, fileName);

    fs.stat(filePath, function(error, stat) {
      if (error) { return file(error, stat); }

      if (stat.isDirectory()) { readDir(filePath, done); }
      else if (stat.isFile()) {
        fs.readFile(filePath, { encoding: 'utf8' }, function(error, content) {
          var file = { path: path.join(base, fileName), content: content };

          done(error, file);
        });
      }
    });
  });
}

readDir(basePath, function(error, files) {
  if (error) { return error; }
  var output = 'module.exports = ' + JSON.stringify(files, null, 2) + ';';

  fs.writeFileSync(outputFile, output);
});
