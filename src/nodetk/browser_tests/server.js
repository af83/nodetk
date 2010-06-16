var http = require("http"),
    sys = require("sys"),
    URL = require("url"),
    fs = require("fs"),
    exec = require('child_process').exec;


var file_resources = {
  '/assert.js': '/home/virtuo/bin/node/lib/assert.js',
  '/sys.js': '/home/virtuo/bin/node/lib/sys.js',
  '/child_process.js': __dirname + '/nodejs/child_process.js',

  '/nodetk/testing/tests_runner.js': __dirname + '/../testing/tests_runner.js',
  '/nodetk/logging.js': __dirname + '/../logging.js',
  '/nodetk/testing/custom_assert.js': __dirname + '/../testing/custom_assert.js',
  '/nodetk/orchestration/callbacks.js': __dirname + '/../orchestration/callbacks.js',
  '/nodetk/tests/orchestration/test_callbacks.js': __dirname + '/../tests/orchestration/test_callbacks.js',
  '/nodetk/utils.js': __dirname + '/../utils.js',
  '/nodetk/tests/test_utils.js': __dirname + '/../tests/test_utils.js',
  '/nodetk/text/search.js': __dirname + '/../text/search.js',
  '/nodetk/tests/text/test_search.js': __dirname + '/../tests/text/test_search.js',

  '/tests.html': __dirname + '/tests.html',
  '/tests.js': __dirname + '/tests.js',

  '/yabble.js': __dirname + '/../../../vendor/yabble/lib/yabble.js',
}

var serve_static_file = function(fpath, response) {
  /* Send file (located at fpath) as response.
   */
  headers = {'Content-Encoding': "chunked"};
  if(fpath.match(/\.js$/)) headers['Content-Type'] = 'application/javascript';
  else if(fpath.match(/\.css$/)) headers['Content-type'] = 'text/css';
  else if(fpath.match(/\.html$/)) headers['Content-Type'] = 'text/html';

  response.writeHead(200, headers);
  var rs = fs.createReadStream(fpath, {encoding: 'binary'});
  rs.addListener('data', function(chunk) {
    response.write(chunk, 'binary');
  });
  rs.addListener('end', function() {
    response.end();
  });
};


http.createServer(function (request, response) {

  var url = URL.parse(request.url);

  if(url.pathname in file_resources) {
    var fpath = file_resources[url.pathname];
    return serve_static_file(fpath, response);
  }

  response.writeHead(301, {'Location': '/tests.html'});
  response.end();

}).listen(8549);
sys.puts('Server listning on http://localhost:8549' +
         '\nGo there to run browsers tests.');

