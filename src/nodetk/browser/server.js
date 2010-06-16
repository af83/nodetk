var URL = require('url');

var web = require('nodetk/web');
var nodetkfs = require('nodetk/fs');
var utils = require('nodetk/utils');


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
      var fpath = pathname2path[url.pathname];
      if(fpath) {
        web.serve_static_file(fpath, response);
      }
    });
  });
};

