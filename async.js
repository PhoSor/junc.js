function map(array, transform, finish) {
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
}


module.exports.map = map;
