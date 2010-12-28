var assert = require('nodetk/testing/custom_assert');
var serializer = require('nodetk/serializer');


var VALS = [
  -4
  , 0
  , 42
  , null
  , true
  , false
  , []
  , ["a",2]
  , {}
  , ''
  , 12554322
  , "short str"
  , "Some long string that would take a lot of place !!!!"
  , {name: "Pierre"}
  , {name: "Cécile"}
  , {nested: {structure: ['some', 'öi']}}
  ];


exports.tests = [

['dump_str & laod_str', VALS.length * 2, function() {
  VALS.forEach(function(val) {
    var dump = serializer.dump_str(val);
    var original = serializer.load_str(dump);
    assert.deepEqual(original, val);
    // Algorithm determinist:
    var dump2 = serializer.dump_str(val);
    assert.equal(dump, dump2);
  });
}],

['dump_secure_str', VALS.length * 2, function() {
  var encrypt_key = 'somesecretkey';
  var validate_key = 'anothersecretstring';
  VALS.forEach(function(val) {
    var res = serializer.dump_secure_str(val, encrypt_key, validate_key);
    var original = serializer.load_secure_str(res, encrypt_key, validate_key);
    assert.deepEqual(original, val);
    // The result string must vary between different calls:
    var res2 = serializer.dump_secure_str(val, encrypt_key, validate_key);
    assert.notEqual(res, res2);
  });
}],

];

