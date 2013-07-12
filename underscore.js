/**
 * @fileoverview Альтернативная реалиция требуемых функций
 * одноименной(underscore.js) библиотеки.
 * @author pho.nzp@gmail.com (Andrey Sorokin)
 * @license MIT.
 */


/** Определяет экспорт. */
var underscore = module.exports;


/**
 * Рекурсивно "сплющивает" многомерный массив в одномерный.
 * @param {Array} array Сжимаемый массив.
 * @param {Array} results Промежуточный результат.
 * @return {Array}
 */
underscore.flatten = function(array, results) {
  var results = results || [];

  array.forEach(function(item) {
    if (item instanceof Array) {
      underscore.flatten(item, results);
    } else {
      results.push(item);
    }
  });

  return results;
};

