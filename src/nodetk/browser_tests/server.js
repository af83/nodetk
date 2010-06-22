
require.paths.unshift(__dirname + '/../../');

var http = require("http"),
    sys = require("sys"),

    bserver = require('nodetk/browser/server');


var server = http.createServer();
bserver.serve_modules(server, {
  modules: ['assert', 'sys'],
  packages: ['nodetk'],
  additional_files: {
    '/tests.html': __dirname + '/tests.html',
    '/tests.js': __dirname + '/tests.js'
  }
});

server.listen(8549);
sys.puts('Server listning...' +
         '\nGo on http://localhost:8549/tests.html to run browsers tests.');


