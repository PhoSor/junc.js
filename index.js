#!/usr/bin/env node

var fs = require('./fs'),
    Deps = require('./graph');

var configName = process.argv[2] || 'config.json',
    configs = fs.readJSON(configName),
    commentRegExp = /\/\*\*[\s\S]*?\*\//,
    provideRegExp = /@provide[\s]*([\w\.]+)/,
    requireRegExp = /@require[\s]*([\w\.]+)/g,
    outputs = [];

function regexp(pattern) {
  return new RegExp(pattern);
}

configs.forEach(function(config) {
  outputs.push(config.output);

  config.filter = (config.filter || []).map(regexp);
  config.reject = (config.reject || []).map(regexp);
});

configs.forEach(function(config) {
  var options = {
    filter: config.filter,
    reject: config.reject.concat(outputs)
  };

  fs.readFiles(config.basePath, options, function(error, files) {
    var output, fileContent, resolved, provides = {}, deps = new Deps;

    files.forEach(function(file) {
      var comment, provide, require, requires = [];

      comment = file.content.match(commentRegExp);
      if (comment) {
        comment = comment[0];
        provide = comment.match(provideRegExp)[1];

        require = requireRegExp.exec(comment);
        while (require) {
          requires.push(require[1]);
          require = requireRegExp.exec(comment);
        }
        deps.add(provide, requires);
        provides[provide] = file;
      }
    });

    output = fs.createWriteStream(fs.join(config.basePath, config.output));
    resolved = deps.getResolved(config.entry);
    resolved.forEach(function(provideName) {
      fileContent = provides[provideName].content;
      output.write(fileContent);
    });
    output.end();
    console.log(config.output, resolved);
  });
});

