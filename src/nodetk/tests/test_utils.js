
var assert = require('nodetk/testing/custom_assert');
var utils = require('nodetk/utils');


exports.tests = [

['extend nothing', 1, function() {
  var res = utils.extend();
  assert.deepEqual(res, {});
}],

['extend only target', 2, function() {
  var target = {name: 'toto'};
  var res = utils.extend(target);
  assert.deepEqual(res, target);
  assert.equal(res, target);
}],

['extend target with one obj', 3, function() {
  var target = {name: 'toto'};
  var obj1 = {lastname: 'titi'};
  var res = utils.extend(target, obj1);
  assert.deepEqual(res, {name: 'toto', lastname:'titi'});
  assert.equal(res, target);
  assert.deepEqual(obj1, {lastname: 'titi'});
}],

['extend target with two objs', 4, function() {
  var target = {name: 'toto'};
  var obj1 = {lastname: 'titi'};
  var obj2 = {tutu: 'tutu'};
  var res = utils.extend(target, {lastname: 'titi'}, {tutu: 'tutu'});
  assert.deepEqual(res, {name: 'toto', lastname:'titi', tutu: 'tutu'});
  assert.equal(res, target);
  assert.deepEqual(obj1, {lastname: 'titi'});
  assert.deepEqual(obj2, {tutu: 'tutu'});
}],

['count properties', 3, function() {
  assert.equal(utils.count_properties({}), 0);
  assert.equal(utils.count_properties({toto: 'titi'}), 1);
  assert.equal(utils.count_properties({toto: 'titi', a:1, b:0}), 3);
}],

['isArray()', 10, function() {
  var arrays = [[], ['a'], [1, 2], [{}]],
      not_arrays = [{}, 'a', "abc", {a: "toto"}, '', 3];
  arrays.forEach(function(e) {assert.ok(utils.isArray(e))});
  not_arrays.forEach(function(e) {assert.ok(!utils.isArray(e))});
}],

['each(obj, callback)', 4, function() {
  var expected = {
    'toto': 'titi',
    3: "tutu",
   'a': undefined
  };
  utils.each({
    toto: 'titi',
    3: 'tutu',
    a: undefined
  }, function(key, val) {
    var v = expected[key]
    assert.equal(v, val);
    delete expected[key];
  });
  assert.deepEqual(expected, {});
}],

];

