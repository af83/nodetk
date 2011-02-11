
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
  var res = utils.extend(target, obj1, obj2);
  assert.deepEqual(res, {name: 'toto', lastname:'titi', tutu: 'tutu'});
  assert.equal(res, target);
  assert.deepEqual(obj1, {lastname: 'titi'});
  assert.deepEqual(obj2, {tutu: 'tutu'});
}],


['deep extend with nothing', 1,function() {
  var res = utils.deep_extend();
  assert.deepEqual(res, {});
}],

['deep extend only target', 2, function() {
  var target = {name: 'toto'};
  var res = utils.extend(target);
  assert.deepEqual(res, target);
  assert.equal(res, target);
}],

['deep extend target with one obj', 3, function() {
  var target = {name: 'toto', friends: ['riri'], mother: {name: "Mimi"}};
  var obj1 = {lastname: 'titi', friends: ['fifi', 'loulou'], mother: {id: 1}};
  var res = utils.deep_extend(target, obj1);
  assert.deepEqual(res, {
    name: 'toto'
  , lastname:'titi'
  , mother: {id: 1, name: "Mimi"}
  , friends: ['fifi', 'loulou']
  });
  assert.equal(res, target);
  assert.deepEqual(obj1, 
         {lastname: 'titi', friends: ['fifi', 'loulou'], mother: {id: 1}});
}],

['deep extend target with two objs', 2, function() {
  var target = {e: 'e'};
  var obj1 = {lastname: 'titi', a: {b: {c: 'c'}}};
  var obj2 = {tutu: 'tutu', a: {b: {d: 'd'}}};
  var res = utils.deep_extend(target, obj1, obj2);
  assert.deepEqual(res, {
    e: 'e', lastname: 'titi', tutu: 'tutu',
    a: {b: {c: 'c', d: 'd'}}
  });
  assert.equal(res, target);
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

