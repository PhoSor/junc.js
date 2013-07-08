var module = require('module');

var module_load = module._load;
// var originalRequire = module.prototype.require;


exports.enable = function() {
  // module.prototype.require = function(path, useOriginal) {
    // var isError, mockPath;

    // if (useOriginal) {
      // // console.log(useOriginal, __dirname, path);
      // return originalRequire(path);
    // }
    // try {
      // mockPath = __dirname + '/' + path + '.mock';
      // console.log(useOriginal, __dirname, path, mockPath);
      // // path = './' + path;
      // return originalRequire(mockPath);
    // } catch (error) {
      // return originalRequire(__dirname + '/' + path);
    // }

    // if (isError || useOriginal) {
      // console.log(useOriginal, __dirname, path);
      // return originalRequire(__dirname + '/' + path);
    // }
  // };
  module._load = function(request, parent, isMain) {
    var mockRequest = __dirname + '/' + request + '.mock';

    // console.log(module.prototype.useOriginal);
    try {
      return module_load(mockRequest, parent, isMain);
    } catch (error) {
      return module_load(request, parent, isMain);
    }
  };
};
