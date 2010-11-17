var http = require('http');
var URL = require('url');


exports.get_test_http_server = function() {
  /* Returns HTTP server responding what you tell it to. For testing purpose.
   * The server does not listen when returned.
   * Every time a request arrives, shift a callback to handle (request, response)
   * from the responders.
   */
  var responders = [];
  var server = http.createServer(function(request, response) {
    var responder = responders.shift();
    if(!responder) throw "No responder for test server";
    responder(request, response);
  });
  return {
    server: server,
    responders: responders,           
  };
}

