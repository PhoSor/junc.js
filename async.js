var async = {
  map: function(array, transform, finish) {
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
  },
  parallel: function(object, finish) {
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
  }
};



module.exports = async;
