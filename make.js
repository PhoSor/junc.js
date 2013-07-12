/**
 * @fileoverview Набор базовых функций.
 * @author pho.nzp@gmail.com (Andrey Sorokin)
 * @license MIT.
 */


/** Создает объект экспорта. */
var make = exports = module.exports = {};


/**
 * Возвращает тип указанного объекта.
 * @param {*} object Объект.
 * @return {string} Тип объекта.
 */
make.type = function(object) {
  return ({}).toString.call(object).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};
