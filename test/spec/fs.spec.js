var mockCoreMods = require('../support/mock-core-modules');
mockCoreMods.enable();

var fs = require('../../lib/fs');

describe('Расширенный fs', function() {
  describe('readJSON', function() {
    it('должно возвращать объект', function() {
      var json = fs.readJSON('config.json');

      expect(json[0].basePath).toEqual('.');
    });

    it('должно возвращать исключение при несщуствующем файле', function() {
      expect(fs.readJSON).toThrow();
    });
  });
});
