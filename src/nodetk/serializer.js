
require.paths.unshift(__dirname + '/../../vendor/node-base64')

var crypto = require('crypto')

  , base64 = require('base64')

  , random_str = require('nodetk/random_str')
  ;


exports.dump_str = function(obj) {
  /* Returns dump of the given JSON obj as a str.
   * There is no encryption, and it might not be safe.
   * Might throw an error.
   *
   * Arguments:
   *  - obj: JSON obj.
   *
   */
  return base64.encode(JSON.stringify(obj));
};


exports.load_str = function(str) {
  /* Returns obj loaded from given string. 
   * Might throw an error.
   *
   * Arguments:
   *  - str: string representation of obj to load.
   *
   */
  return JSON.parse(base64.decode(str));
};


var sign_str = function(str, key) {
  /* Return base64 signed sha1 hash of str using key */
  var hmac = crypto.createHmac('sha1', key);
  hmac.update(str);
  return hmac.digest('base64');
};


var CYPHER = 'aes256';
var CODE_ENCODING = "hex";
var DATA_ENCODING = "utf8";

exports.dump_secure_str = function(obj, encrypt_key, validate_key) {
  /* Return str representing the given obj. It is signed and encrypted using the
   * given keys.
   */
  // TODO XXX: check the validity of the process
  // Do we need some timestamp to invalidate too old data?
  var nonce_check = random_str.randomString(48); // 8 chars
  var nonce_crypt = random_str.randomString(48); // 8 chars
  var cypher = crypto.createCipher(CYPHER, encrypt_key + nonce_crypt);  
  var data = JSON.stringify(obj);
  var res = cypher.update(nonce_check, DATA_ENCODING, CODE_ENCODING);
  res += cypher.update(data, DATA_ENCODING, CODE_ENCODING);
  res += cypher.final(CODE_ENCODING);
  var digest = sign_str(data, validate_key + nonce_check);
  return digest + nonce_crypt + res;
};

exports.load_secure_str = function(str, encrypt_key, validate_key) {
  /* Given a string resulting from dump_secure_str, load corresponding JSON.
   */
  var expected_digest = str.substring(0, 28);
  var nonce_crypt = str.substring(28, 36);
  var encrypted_data = str.substring(36, str.length);
  var decypher = crypto.createDecipher(CYPHER, encrypt_key + nonce_crypt);
  var data = decypher.update(encrypted_data, CODE_ENCODING, DATA_ENCODING);
  data += decypher.final(DATA_ENCODING);
  var nonce_check = data.substring(0, 8);
  data = data.substring(8, data.length);
  var digest = sign_str(data, validate_key + nonce_check);
  if(digest != expected_digest) throw new Error("Bad digest");
  return JSON.parse(data);
};

