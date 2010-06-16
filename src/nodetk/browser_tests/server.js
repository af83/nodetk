
require.paths.unshift(__dirname + '/../../');

var http = require("http"),
    sys = require("sys"),

    bserver = require('nodetk/browser/server');


var server = http.createServer();
bserver.serve_modules(server, {
  modules: [
    'assert', 'sys',
    'nodetk/testing/tests_runner',
    'nodetk/logging',
    'nodetk/testing/custom_assert',
    'nodetk/orchestration/callbacks',
    'nodetk/tests/orchestration/test_callbacks',
    'nodetk/utils',
    'nodetk/tests/test_utils',
    'nodetk/text/search',
    'nodetk/tests/text/test_search'
  ],
  additional_files: {
    '/tests.html': __dirname + '/tests.html',
    '/tests.js': __dirname + '/tests.js',
    '/yabble.js': __dirname + '/../../../vendor/yabble/lib/yabble.js',
    '/child_process.js': __dirname + '/nodejs/child_process.js',
    '/events.js': __dirname + '/nodejs/events.js'
  }
});

server.listen(8549);
sys.puts('Server listning on http://localhost:8549' +
         '\nGo there to run browsers tests.');

