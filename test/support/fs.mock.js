var files = {}, filesArray = require('./files');

var fs = exports = module.exports = {};

// console.log(filesArray);
filesArray.forEach(function(file) {
  files[file.path] = file;
});

fs.readdirSync = function(path) {
  console.log(path);
  return ['file1', 'file2'];
};


fs.readFileSync = function(path) {
  var content;

  console.log(__dirname, path);
  if (files[path]) { content = files[path].content; }
  else { throw new Error('Not found: ' + path); }

  return content;
};
