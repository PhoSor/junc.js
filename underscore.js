function flatten(array, results) {
  var results = results || [];

  array.forEach(function(item) {
    if (item instanceof Array) {
      flatten(item, results);
    } else {
      results.push(item);
    }
  });

  return results;
}

exports.flatten = flatten;
