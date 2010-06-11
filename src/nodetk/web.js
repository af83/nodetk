var http = require('http');
var sys = require('sys');
var URL = require('url');
var debug = require('nodetk/logging').debug;

var extend = require('./utils').extend;


var check_url = exports.check_url = function(url, options, callback, fallback) {
  /* Try to fetch the response for this URL and call the callback with:
   *  {location: url,
   *   'content-type': ...,
   *   'content-length': ...
   *  }
   * 
   * If the response in a 301, try to fetch the page at the given location.
   * The url is the returned is the last used.
   *
   * If the response is not in 200 range or any other error, just don't call
   * the callback.
   *
   * Arguments:
   *  - url: what to check.
   *  - callback: fct to call with result once done.
   *  - options: optional, default to {max_redirect: 3}.
   */
  var options = extend({
    max_redirects: 3
  }, options);
  var parsed_url;
  try {
    parsed_url = URL.parse(url);
  } catch (e) {
    sys.puts("Error on client:", error.message, '\n', error.stack);
    fallback && fallback(error);
  }
  var client = http.createClient(parsed_url.port || 80, parsed_url.hostname);
  client.addListener('error', function(error) {
    sys.puts("Error on client:", error.message, '\n', error.stack);
    fallback && fallback(error);
  });
  var path = (parsed_url.pathname || '/') + (parsed_url.search || '');
  var request = client.request('GET', path, {host: parsed_url.host});
  request.addListener('response', function(response) {
    if(response.statusCode >= 300 && response.statusCode < 400 &&
       options.max_redirects > 0) {
      var url2 = response.headers['location'];
      options.max_redirects -= 1;
      check_url(url2, options, callback, fallback);
    }
    else if(response.statusCode >= 200 && response.statusCode < 300) {
      ct = response.headers['content-type'];
      callback && callback({
        location: url, 
        'content-type': response.headers['content-type'],
        'content-length': response.headers['content-length']
      });
    }
    else fallback && fallback('Bad status code or too many redirects.');
  });
  request.end();
}

