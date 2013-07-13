var _ = require('../../lib/underscore');


describe('Underscore', function() {
  describe('flatten', function() {
    it('должно обрабатывать пустой массив', function() {
      var result = _.flatten([]);

      expect(result).toEqual([]);
    });

    it('должно обрабатывать непустой массив', function() {
      var result = _.flatten([1, 2, 3, 4, 5]);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('должно сплющивать вложенные массивы', function() {
      var result = _.flatten([1, 2, [3], [4, [5], 6], 7]);

      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });
});
