var make = require('../../lib/make');

describe('make', function() {
  describe('type', function() {
    it('должно возвращать верный тип', function() {
      expect(make.type([])).toEqual('array');
      expect(make.type({})).toEqual('object');
      expect(make.type(null)).toEqual('null');
      expect(make.type(new Date)).toEqual('date');
    });
  });
});
