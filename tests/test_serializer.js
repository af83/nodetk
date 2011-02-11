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


var dont_call = function() {
  assert.ok(false, "must no be called");
};

var to_restore = ['dump_secure_str', 'load_secure_str'];
var originals = {};
to_restore.forEach(function(original) {
  originals[original] = serializer[original];
});
exports.module_clode = function() {
  to_restore.forEach(function(original) {
    serializer[original] = originals[original];
  });
};


exports.tests = [

['dump_str & load_str', VALS.length * 2, function() {
  VALS.forEach(function(val) {
    var dump = serializer.dump_str(val);
    var original = serializer.load_str(dump);
    assert.deepEqual(original, val);
    // Algorithm must be determinist:
    var dump2 = serializer.dump_str(val);
    assert.equal(dump, dump2);
  });
}],

['dump_secure_str load_secure_str', VALS.length * 2, function() {
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

['SecureSerializer.dump_str', 3, function() {
  var ss = new serializer.SecureSerializer('crypt', 'valid');
  var expected_obj = {}
  serializer.load_secure_str = dont_call;
  serializer.dump_secure_str = function(obj, ck, vk) {
    assert.equal(obj, expected_obj);
    assert.equal(ck, 'crypt');
    assert.equal(vk, 'valid');
    serializer.dump_secure_str = dont_call;
  };
  ss.dump_str(expected_obj)
}],

['SecureSerializer.load_str', 3, function() {
  var ss = new serializer.SecureSerializer('crypt', 'valid');
  var expected_str = "secret"
  serializer.dump_secure_str = dont_call;
  serializer.load_secure_str = function(str, ck, vk) {
    assert.equal(str, expected_str);
    assert.equal(ck, 'crypt');
    assert.equal(vk, 'valid');
    serializer.load_secure_str = dont_call;
  };
  ss.load_str(expected_str)
}],

];

