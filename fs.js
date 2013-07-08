var fs = require('fs');

fs.readJSON = function(filePath) {
  var fileContent = fs.readFileSync(filePath, {encoding: 'utf8'}),
      json = JSON.parse(fileContent);

  return json;
};

module.exports = fs;
