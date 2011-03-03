var fs = require('fs');
var http = require('http');
var URL = require('url');
var querystring = require('querystring');
var debug = require('nodetk/logging').debug;

var extend = require('./utils').extend;



//--------------------------------------------------

var REQ = function(type, url, data, options, callback) {
  /* Make a request to the given URL, and call:
   *  callback(http_code, headers, data);
   *
   * Arguments:
   *  - options: hash, with the possible members:
   *    - emulate_browser: Add some firefox headers if set to True
   *    - additional_headers: hash containing some headers to add / redefine.
   */
  var body;
  var purl = URL.parse(url);
  var qs = purl.query || '';
  var secure = purl.protocol == 'https:';
  var default_port = secure && 443 || 80;
  var client = http.createClient(purl.port || default_port, purl.hostname, secure);
  client.addListener('error', function(err) {
    console.log('Error in nodetk web client.');
    console.log(err.message);
    console.log(err.stack);
  });
  var headers = {
    'host': purl.hostname,
  };
  extend(headers, options.additional_headers || {});
  if(options.emulate_browser) extend(headers, {
    'User-Agent': 'Mozilla/5.0 (X11; U; Linux i686; fr; rv:1.9.1.9) Gecko/20100401 Ubuntu/9.10 (karmic) Firefox/3.5.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'fr-fr,fr;q=0.8,en;q=0.5,en-us;q=0.3',
    //'Accept-Encoding': 'gzip,deflate',
  });
  if(type == 'POST' || type == 'PUT' || type == "DELETE") {
    body = data && querystring.stringify(data) || "";
    headers['content-type'] = 'application/x-www-form-urlencoded';
    headers['content-length'] = Buffer.byteLength(body);
  }
  else if (data) {
    if(qs) qs += '&';
    qs += querystring.stringify(data);
  }
  var request = client.request(type, purl.pathname +'?'+ qs, headers);
  if(body) {
    request.write(body, 'utf8');
  }
  request.end();
  var data = '';
  request.on('response', function(response) {
    response.setEncoding('utf8');
    response.on('data', function(chunk) {
      data += chunk;
    });
    response.on('end', function() {
      callback(response.statusCode, response.headers, data);
    });
  });
}

var GET = exports.GET = function(url, data, callback, options) {
  if(data == {}) data = null;
  return REQ('GET', url, data, options || {}, callback, options);
};

var POST = exports.POST = function(url, data, callback, options) {
  return REQ('POST', url, data, options || {}, callback, options);
};
// ----------------------------------------------------------


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
  } catch (error) {
    debug("Error on client:", error.message, '\n', error.stack);
    return fallback && fallback(error);
  }
  var client = http.createClient(parsed_url.port || 80, parsed_url.hostname);
  client.addListener('error', function(error) {
    console.log("Error on client:", error.message, '\n', error.stack);
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


exports.serve_static_file = function(fpath, response, before, after) {
  /* Send file (located at fpath) as response (http.ServerResponse).
   *
   * Arguments:
   *  - fpath: path to the file you want to send.
   *  - response: http.ServerResponse obj.
   *  - before: optional, string to append at the beggining of the file.
   *  - after: optional, string to append at the end of the file.
   *
   */
  headers = {'Content-Encoding': "chunked"};
  if(fpath.match(/\.js$/)) headers['Content-Type'] = 'application/javascript';
  else if(fpath.match(/\.css$/)) headers['Content-type'] = 'text/css';
  else if(fpath.match(/\.html$/)) headers['Content-Type'] = 'text/html';

  response.writeHead(200, headers);
  if(before) response.write(before);
  var rs = fs.createReadStream(fpath, {encoding: 'binary'});
  rs.addListener('data', function(chunk) {
    response.write(chunk, 'binary');
  });
  rs.addListener('end', function() {
    if(after) response.write(after);
    response.end();
  });
};

