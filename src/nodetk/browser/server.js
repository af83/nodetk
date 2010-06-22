var URL = require('url');

var web = require('nodetk/web');
var nodetkfs = require('nodetk/fs');
var utils = require('nodetk/utils');

var sys = require("sys");

exports.serve_modules = function(server, options) {
  /** Serve modules/packages/files using the specified http server.
   *
   * Arguments:
   *  - server: http.Server
   *  - options:
   *    - modules: Array of modules we want to serve. There modules will be 
   *      searched on require.paths when this function is initialized.
   *    - packages: Array of packages we want to serve. Same as if you had
   *      pass all modules of the packages
   *    - additional_files: dict associating a request pathname to a file path.
   *      These pathnames will be served with file at given path.
   * 
   */
  
  options = utils.extend({
    modules: [],
    packages: [],
    additional_files: {}
  }, options);

  utils.extend(options.additional_files, {
    '/init_browser.js': __dirname + "/static/init_browser.js",
    '/yabble.js': __dirname + '/../../../vendor/yabble/lib/yabble.js',
    '/child_process.js': __dirname + '/static/child_process.js',
    '/events.js': __dirname + '/static/events.js'
  });

  var fpaths = nodetkfs.find_modules_paths(options.modules);
  nodetkfs.find_packages_paths(options.packages, function(fpaths2) {
    utils.extend(fpaths, fpaths2);

    var pathname2path = {};
    for(var mname in fpaths) {
      pathname2path['/' + mname + '.js'] = fpaths[mname];
    }
  
    utils.extend(pathname2path, options.additional_files);
  
    server.addListener('request', function(request, response) {
      var url = URL.parse(request.url);
      var wraps = false,
          pathname = url.pathname;
      if(pathname.slice(0, 12) == '/wrapped_js/') {
        wraps = true;
        pathname = pathname.slice(11, pathname.length);
      }
      var fpath = pathname2path[pathname];
      if(fpath) {
        var name, before, after;
        if(wraps) {
          name = pathname.slice(1, pathname.length-3);
          before = 'require.define({"' + name + '":';
          before += 'function(require, exports, module) {';
          after = '}}, []);';
        }
        web.serve_static_file(fpath, response, before, after);
      }
    });
  });
};

