
require.paths.unshift(__dirname + '/../../');

var http = require("http"),
    bserver = require('nodetk/browser/server');

var connector = bserver.serve_modules_connector( {
  modules: ['assert', 'util'],
  packages: ['nodetk'],
  additional_files: {
    '/tests.html': __dirname + '/tests.html',
    '/tests.js': __dirname + '/tests.js'
  }
});

var server = http.createServer(function(req, res) {
  connector(req, res, function() {
    res.writeHead(404, {});
    res.end();
  });
});
server.listen(8549, function() {
  console.log('Server listning...' +
              '\nGo on http://localhost:8549/tests.html to run browsers tests.');
});


