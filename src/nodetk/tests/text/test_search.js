var sys = require("sys");
var assert = require("nodetk/testing/custom_assert");
var debug = require('nodetk/logging').debug;
var utils = require('nodetk/utils');

var search = require('nodetk/text/search');


exports.tests = [

['extract_URLs', 6, function() {
  var text, expected;

  text = "There is no URL in there!";
  expected = [];
  assert.deepEqual(search.extract_URLs(text), expected);

  text = "www.google.com";
  expected = ['http://www.google.com'];
  assert.deepEqual(search.extract_URLs(text), expected);
  
  text = "http://www.google.com";
  expected = ['http://www.google.com'];
  assert.deepEqual(search.extract_URLs(text), expected);

  text = "Good stuff:www.google.com, I like it!";
  expected = ['http://www.google.com'];
  assert.deepEqual(search.extract_URLs(text), expected);

  text = "Good stuff:www.google.com, http://toto.com/tutu?titi=toto#tata: I like it!";
  expected = ['http://www.google.com', 'http://toto.com/tutu?titi=toto#tata'];
  assert.deepEqual(search.extract_URLs(text), expected);

  text = 'Write me an email to titi@tutu.com!';
  expected = ['titi@tutu.com'];
  assert.deepEqual(search.extract_URLs(text), expected);


}],


]

