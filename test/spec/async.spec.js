var async = require('../../async');

describe('Async', function() {
  var noop = function(value, done) { done(null, value) };

  describe('map', function() {
    it('должно обрабатывать пустой массив', function(done) {
      async.map([], noop, function(error, results) {
        expect(error).toBe(null);
        expect(results).toEqual([]);
        done();
      });
    });

    it('должно обрабатывать непустой массив', function(done) {
      function iterator(value, done) {
        done(null, value + 2);
      }

      async.map([1, 2, 3, 4, 5], iterator, function(error, results) {
        expect(error).toBe(null);
        expect(results).toEqual([3, 4, 5, 6, 7]);
        done();
      });
    });

    it('должно прерываться при ошибке', function(done) {
      function iterator(value, done) {
        if (value == 3) { done('value == 3', value); }
        else { done(null, value + 2); }
      }

      async.map([1, 2, 3, 4, 5], iterator, function(error, results) {
        expect(error).toBe('value == 3');
        expect(results).toEqual([3, 4, 3]);
        done();
      });
    });
  });
});
