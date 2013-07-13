/**
 * @fileoverview Расширяет стандартный модуль fs.
 * @author pho.nzp@gmail.com (Andrey Sorokin)
 * @license MIT.
 */


/** Зависимости. */
var fs = require('fs');


/** Определяет экспорт. */
module.exports = fs;


/**
 * Синхронно читает содержимое файла и
 * возвращет его содержимое в виде объекта.
 * @param {string} filePath Путь к файлу.
 * @return {Object}
 */
fs.readJSON = function(filePath) {
  var fileContent = fs.readFileSync(filePath, {encoding: 'utf8'}),
      json = JSON.parse(fileContent);

  return json;
};

