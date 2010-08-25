var sys = require('sys');

var assert = require('nodetk/testing/custom_assert');
var utils = require('nodetk/utils');
var debug = require('nodetk/logging').debug;
var testing_server = require('nodetk/testing/server');

var web = require('nodetk/web');


var test_server;
var port = 8769;
var url = 'http://127.0.0.1:' + port;


exports.module_init = function(callback) {
  test_server = testing_server.get_test_http_server();
  test_server.server.listen(port, callback);
}

exports.module_close = function(callback) {
  test_server.server.close();
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


var responder_empty_header = function(request, response) {
  response.writeHead(301, {
    "a": "",
    "Location": url + "/toto"
  });
  response.end('\n');
};


var responder_mirror = function(request, response) {
  response.writeHead(200, {});
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    response.end(JSON.stringify([
      request.method,
      request.url,
      request.headers,
      data
    ]));
  });
}

exports.tests = [

['GET', 1, function() {
  test_server.responders.push(responder_mirror);
  var options = {
    additional_headers: {toto: 'titi'}
  };
  web.GET(url + '/toto/titi?param=tata', {
    param2: 'tutu'
  }, function(statusCode, headers, data) {
    assert.deepEqual(JSON.parse(data), [
      "GET",
      "/toto/titi?param=tata&param2=tutu",
      {"host":"127.0.0.1","connection":"close","toto":"titi"},
      ''
    ]);
  }, options);
}],

['POST', 1, function() {
  test_server.responders.push(responder_mirror);
  web.POST(url + '/toto/titi?param=tata', {
    param2: 'tutu'
  }, function(statusCode, headers, data) {
    assert.deepEqual(JSON.parse(data), [
      "POST",
      "/toto/titi?param=tata",
      {
        "host": "127.0.0.1",
        "connection": "close",
        "content-type": "application/x-www-form-urlencoded",
        "transfer-encoding": "chunked"
      },
      'param2=tutu'
    ]);
  });
}],

// ------------------------------------------------------


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
    assert.ok(err);
  });
}],

['check url: empty header field', 1, function() {
  test_server.responders.push(responder_empty_header);
  test_server.responders.push(responder_ok);
  web.check_url(url, {}, function(info) {
    assert.deepEqual(info, {
      "content-type": "text/html; charset=UTF-8",
      "content-length": 6,
      'location': url + '/toto'
    });
  }, function(err) {
    assert.ok(false, 'This should never be called.');
  });
}],

]

