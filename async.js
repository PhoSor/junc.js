/**
 * @fileoverview Альтернативная реалиция требуемых функций
 * одноименной(async.js) библиотеки.
 * @author pho.nzp@gmail.com (Andrey Sorokin)
 * @license MIT.
 */


/** Определяет экспорт. */
var async = module.exports;


/**
 * Асинхронная реализация map.
 * @param {Array.<*>} array Итерируемый массив.
 * @param {function(*, function(*, *))} transform Функция,
 * вызываемая с каждым элементом исходного массива.
 * @param {function(*, Array.<*>)} finish Функция,
 * вызываемая при завершении итерации массива.
 */
async.map = function(array, transform, finish) {
  var i, ended, results = [];

  function done(error, transformed) {
    if (ended) return;

    results.push(transformed);
    if (array.length === results.length || error) {
      ended = true;
      finish(error, results);
    }
  }

  for (i = 0; i < array.length; i++) {
    transform(array[i], done);
  }

  if (!array.length) {
    finish(null, results);
  }
};


/**
 * Асинхронно выполняет функции, являющиеся свойствами объекта.
 * @param {Object.<string, function(function(*, *))>} object Итерируемый массив.
 * @param {function(*, Object.<string, *>)} finish Функция.
 */
async.parallel = function(object, finish) {
  var key, ended, keyCount = 0, keyDone = 0, results = {};

  for (key in object) {
    if (object.hasOwnProperty(key)) {
      keyCount++;
    }
  }

  function doer(key) {
    return function(error, result) {
      if (ended) return;

      results[key] = result;
      keyDone++;
      if (keyCount === keyDone || error) {
        ended = true;
        finish(error, results);
      }
    };
  }

  for (key in object) {
    if (object.hasOwnProperty(key)) {
      object[key](doer(key));
    }
  }
};

