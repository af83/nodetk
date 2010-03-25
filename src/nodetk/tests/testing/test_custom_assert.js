
var assert = require("nodetk/testing/custom_assert");


exports.tests = [

['same_sets()', 14, function() {
  var same_sets = [
    [[1, 2, 3], [1, 2, 3]],
    [[], []],
    [[1, 3, 2], [3, 1, 2]],
    [[1, 2, 3, 3], [3, 1, 2, 3]],
  ];
  var different_sets = [
    [[1, 2, 3], [1, 3]],
    [[1, 2, 3], [1, 2, 4]],
    [[1, 2, 3, 3], [1, 2, 3]],
  ];
  same_sets.forEach(function(sets) {
    var s1 = sets[0], s2 = sets[1];
    assert.doesNotThrow(function(){assert.same_sets(s1, s2)});
    assert.doesNotThrow(function(){assert.same_sets(s2, s1)});
  });
  different_sets.forEach(function(sets) {
    var s1 = sets[0], s2 = sets[1];
    assert.throws(function(){assert.same_sets(s1, s2)});
    assert.throws(function(){assert.same_sets(s2, s1)});
  });
}],

];
