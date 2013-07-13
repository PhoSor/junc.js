/**
 * @fileoverview Junc.js.
 * @author pho.nzp@gmail.com (Andrey Sorokin)
 * @license MIT.
 */


/** Зависимости. */
var make = require('./make');


/** Определяет экспорт. */
module.exports = junc;


/**
 * @const {string}
 */
var EXT = '.js';


/** @enum {RegExp} */
var regexp = {
  COMMENT: /\/\*\*[\s\S]*?\*\//,
  REQUIRE: /@require[\s]*([\S]+)/g
};



/**
 * @param {Object|Array.<Object>} configs Объект или массив конфигураций.
 * @constructor
 */
function Junc(configs) {
  this.configs = configs;
  this.type = make.type(configs);
}


/**
 * Вызывает указанную функцию с каждой конфигурацией.
 * @param {function(Object)} fn Функция
 * вызываемая с объектом конфигурации.
 */
Junc.prototype.each = function(fn) {
  if (this.type == 'array') { this.configs.forEach(fn); }
  if (this.type == 'object') { fn(this.configs); }
};


function junc(configs) {
  return new Junc(configs);
}


/** Создает экспорт основного класса. */
junc.Junc = Junc;


/**
 * Возвращает массив зависимостей.
 * @param {string} text Текст.
 * @return {Array.<string>}
 */
junc.getRequires = function(text) {
  var comment, require, requires = [];

  comment = text.match(regexp.COMMENT);
  if (comment) {
    comment = comment[0];

    require = regexp.REQUIRE.exec(comment);
    while (require) {
      requires.push(require[1]);
      require = regexp.REQUIRE.exec(comment);
    }
  }

  return requires;
};

