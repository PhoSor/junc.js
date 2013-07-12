/**
 * @fileoverview Набор базовых функций.
 * @author pho.nzp@gmail.com (Andrey Sorokin)
 * @license MIT.
 */


/** Определяет экспорт. */
var make = module.exports;


/**
 * Возвращает тип указанного объекта.
 * @param {*} object Объект.
 * @return {string} Тип объекта.
 */
make.type = function(object) {
  return ({}).toString.call(object).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};
