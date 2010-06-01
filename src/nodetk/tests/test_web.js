var sys = require('sys');

var assert = require('nodetk/testing/custom_assert');
var utils = require('nodetk/utils');
var debug = require('nodetk/logging').debug;
var testing_server = require('nodetk/testing/server');

var web = require('nodetk/web');


var test_server;
var port = 8769;
var url = 'http://127.0.0.1:' + port;
exports.setup = function(callback) {
  if(!test_server) {
    test_server = testing_server.get_test_http_server();
    test_server.server.listen(port);
  }
  callback();
}

var responder_ok = function(request, response) {
  response.writeHead(200, {
    "content-type": "text/html; charset=UTF-8",
    "content-length": 6
  });
  response.end('hello\n');
};


var responder_redirect = function(request, response) {
  response.writeHead(301, {
    "location": url + "/toto"
  });
  response.end('\n');
};


var responder_404 = function(request, response) {
  response.writeHead(404, {
    "content-type": "text/html; charset=UTF-8",
    "content-length": 10,
  });
  response.end('not found\n');
};



exports.tests = [

['check_url_200', 1, function() {
  test_server.responders.push(responder_ok);
  web.check_url(url, {}, function(info) {
    assert.deepEqual(info, {
      "content-type": "text/html; charset=UTF-8",
      "content-length": 6,
      'location': url
    });
  }, function(err) {
    assert.ok(false, "This should never be called");
  });
}],

['check_url_redirect', 1, function() {
  test_server.responders.push(responder_redirect, responder_ok);
  web.check_url(url, {}, function(info) {
    assert.deepEqual(info, {
      "content-type": "text/html; charset=UTF-8",
      "content-length": 6,
      'location': url + '/toto'
    });
  }, function(err) {
    assert.ok(false);
  });
}],

['check url: too many redirects', 1, function() {
  for(var i=0; i<4; i++) test_server.responders.push(responder_redirect);
  web.check_url(url, {}, function(info) {
    assert.ok(false, "This should never be called");
  }, function(err) {
    assert.ok(err);
  });
}],

['check url: 404', 1, function() {
  test_server.responders.push(responder_404);
  web.check_url(url, {}, function(info) {
    assert.ok(false, "This should never be called");
  }, function(err) {
    test_server.server.close();
    assert.ok(err);
  });
}],


]

