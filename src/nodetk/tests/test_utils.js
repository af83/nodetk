
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

];

