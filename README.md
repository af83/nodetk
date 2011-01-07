# nodetk

Works with node v.0.3.0.

## Introduction
nodetk is a set of small libraries intended to facilitate the use of nodejs.
It includes:

 * an orchestration facility, to run a set of functions in parallel or one at a time
 * a debug function, which you can activate/deactivate widely
 * a few functions to manipulate directories or files
 * a test runner, to collect and run tests one at a time
 * some stuff to serve nodejs modules / packages by http server
 * miscellaneous utility functions

## Setup
How to use these libraries / tools :

In your .bashrc (or whatever rc) file, set the bin dir in your PATH env variable:
export PATH=$PATH:/path/to/nodetk/bin

If you which to use the "serve nodejs package / mudules" feature, you should have
the dir where are located the nodejs libs in your NODE_PATH:
<code>
export NODE_PATH=~/bin/node/lib
</code>

and the src dir in your NODE_PATH env variable:
<pre><code>
export NODE_PATH=$NODE_PATH:/path/to/nodetk/src
</code></pre>

You should then be able to use the nodetk modules with something like:
<pre><code>
var callbacks = require("nodetk/orchestration/callbacks");
</code></pre>

You now have the following available commands:
<pre><code>
nodetests [-v] [-d]
</code></pre>

The -v option displays some info about what tests are rand.
The -d option enables the debug functions.


You do not need (and should not) add the nodetk path at the top of your test files...


## Usage

### browser/server

This module provides a [Connect](https://github.com/senchalabs/connect) middleware to serve other nodejs modules to the browser, so they can be used on both server side and client side.
This is using the [Yabble](https://github.com/jbrantly/yabble) library on browser side, and wrapping served modules on fly so you can use same code on browser.
This middleware can also be used to serve static files.

Example of use: 

 - [src/nodetk/browser_tests/server.js](https://github.com/AF83/nodetk/blob/master/src/nodetk/browser_tests/server.js) for server side;
 - [src/nodetk/browser_tests/tests.html](https://github.com/AF83/nodetk/blob/master/src/nodetk/browser_tests/tests.html) for client side initialization.

This module is also used in rest-mongo, see [rest-mongo tests running on browser side](https://github.com/AF83/rest-mongo/tree/master/src/rest-mongo/browser_tests).


### fs

The fs module provides several functions to have a higher level API.

 - getFilesDirs(path, callback, fallback): calls callback(fpaths, dirpaths) with fpaths (respectively dirpaths) being a list of files (respectively directories) present in path. The given path are relative to path. This function doesn't list directories recursively. In case of error, callback is not called, and fallback is called with an error as first argument.
 - getDeepFilesDirs(path, callback, fallback): same as getFilesDirs but list recursively all directories and files in subdirectories.
 - existsSync(path): Synchronous function, returns true if the path exist, false otherwise.
 - find_modules_paths(modules_names): Synchronous function, returns an object associating each module name with its path. If a module is not found, throw an error.
 - find_packages_paths(package_names, callback, fallback): Call callback with object associating every module name (present in one of the given package names) with its path.

Tests : [src/nodetk/tests/test_fs.js](https://github.com/AF83/nodetk/blob/master/src/nodetk/tests/test_fs.js).


### orchestration/callbacks

This module provides functions to facilitate functions calls orchestration.

 - get_waiter(calls_needed, callback, fallback): returns a function which will call the given callback once it has been called calls_needed times. If calls_needed is 0, then the callback is immediatly called. If waiter.fall() is called, then the fallback is called with the same arguments waiter.fall was called with. Tests: [src/nodetk/tests/orchestration/test_callbacks.js](https://github.com/AF83/nodetk/blob/master/src/nodetk/tests/orchestration/test_callbacks.js).
 - empty_awaiting_callbacks(awaiting_callbacks, key, data): awaiting_callbacks should be an object associating keys with list of functions. empty_awaiting_callbacks will remove the key from the obj and call all corresponding functions with data as first argument.
 - add_awaiting_callbacks(awaiting_callbacks, keys, callback): add the callback function to every list of callbacks at awaiting_callbacks[key] for key in keys.
 - sync_calls(fct, args, callback): Runs the fct synchronously for each given set of args in args and then call callback. args is an array of arrays or single values, each inside array/single value being the argument(s) given to fct. sync_calls(fct, [1, ['a', 'b'], 2], callback) will call (synchronously):
  - fct(1)
  - fct('a', 'b')
  - fct(2)
  - callback()


### randomString

This module provides a function to get a [base64url](http://tools.ietf.org/html/rfc4648#section-5) random string.

 - randomString(bits): returns a pseudo-random ASCII string which contains at least the specified number of bits of entropy. The returned value is a string of length ⌈bits/6⌉  of characters from the base64url alphabet.


### serializer

This module provides function to go from JSON obj to [opaque] string or vice & versa.

 - dump_str(obj): Returns dump of the given JSON obj as a str. There is no encryption, and it might not be safe. Might throw an error.
 - load_str(str): Returns obj loaded from given string (result of dump_str function). Might throw an error.
 - sign_str(str, key): Returns base64 signed sha1 hash of str using key.
 - dump_secure_str(obj, encrypt_key, validate_key): Return str representing the given obj. It is signed and encrypted using the given keys.
 - load_secure_str(str, encrypt_key, validate_key): Given a string resulting from dump_secure_str, load corresponding JSON.
 - SecureSerializer(encrypt_key, validate_key): Class to store encryption/validation keys in a more convenient way. The object created will have the methods dump_str(obj) and load_str(str) corresponding to dump_secure_str and load_secure_str.

The cypher used is aes256, the crypted data are in hex. The signing process uses HMAC with SHA1.
Tests : [src/nodetk/tests/test_serializer.js](https://github.com/AF83/nodetk/blob/master/src/nodetk/tests/test_serializer.js).


### server_tools

Provides a few functions helpful when using an HTTP server.

 - get_connector_from_str_routes(routes): returns a Connect middleware from given routes obj. The routes obj looks like:
      {'GET': {"/toto": fct, "/titi": fct},
       'POST': {"/toto": fct},
       'DELETE': {"/tutu/tata/": fct}
       }

 The routes arg is used to search where to route the current req (fct called with req and res). If nothing found, next() is called. Pathnames in routes obj must be strings, not regexps.

 - redirect(res, location): Send redirection HTTP reply to result (location being an absolute URL). res is a nodejs result object.
 - server_error(res, error): Send HTTP 500 result with details about error in body. The content-type is set to text/plain. error can be an Error object or a string.


### testing

This package provides some testing functionalities. 

 - testing/custom_assert defines the same functions as the node assert module + the same_sets functions. All the module functions are wrapped so that the tests runner can count the number of asserts ran and act accordingly.
  - same_sets(actual, expected): check actual and expected arrays have the same values (order doesn't matter).

 - testing/nodetests is the script to run test files in a given directory (and sub-directories).
 - testing/server provides a function to get an HTTP server for testing (a server responding what you tell it to, nothing more).
 - testing/tests_runner is used by nodetests to run tests present in a file.
 - testing/tools is a module providing functions to help when testing HTTP servers:
  - get_expected_res(expected_status_code): Returns a res object making 3 asserts. Check the status code is the one expected, content-type is text/plain and body is not empty.
  - get_expected_redirect_res(location): Idem, check the status code is 303 and location is the one expected.


### text/search

 - extract_URLs(text): Extract and returns list of URLs from given plain text.
  - Are detected: http(s), ftp, fail, email addresses.
  - For URLs starting with 'www.', will append a "http:" at beggining.


### utils

 - extend(target, obj1[, obj2, ...]): the jQuery extend function.
 - count_properties(obj): Counts and returns the number of properties in obj.
 - isArray(obj): Returns True if obj is an Array.
 - each(obj, callback): Calls callback(attr_name, attr_value) for each attr of given Object.


### web

HTTP client and HTTP server utility functions.

 - GET/POST(url, data, callback, options): GET or POST to url with data (as URL parameters for GET, and in request body for POST). Once the request is complete, calls callback(http_code, headers, body). The URL scheme can be http or https. The options parameter is optional, and if given, is a hash with the following possible members:
  - emulate_browser: Add some firefox headers if set to True
  - additional_headers: hash containing some headers to add / redefine.

 - check_url(url, options, callback, fallback): 

  - Try to fetch the response for this URL and call the callback with a hash object containing:
     - location: final URL (after eventual redirects)
     - content-type: the content type header
     - content-length: the content length header

  - This function will follow redirects until 200 class answer is found or too many redirects number have been reached. In such case, callback is not called and fallback is called.
  - The options arguments may contain the max_redirects property, which by default is set to 3.

 - serve_static_file(fpath, response, [before, after]): Send file (located at fpath) as response (http.ServerResponse). before and after are two string optional arguments, which will be added at the beginning / end of the served file.



## License

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see [http://www.fsf.org/licensing/licenses/agpl-3.0.html](http://www.fsf.org/licensing/licenses/agpl-3.0.html)

