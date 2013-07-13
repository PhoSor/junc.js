var fs = require('../../lib/fs');

describe('Расширенный fs', function() {
  describe('readJSON', function() {
    it('должно возвращать объект', function() {
      spyOn(fs, 'readFileSync').andReturn('[{"basePath": "."}]');

      var json = fs.readJSON('config.json');

      expect(json[0].basePath).toEqual('.');
    });

    it('должно бросать исключение при несщуствующем файле', function() {
      expect(function() {
        fs.readJSON('random filename');
      }).toThrow();
    });
  });
});
