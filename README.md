# nodetk

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

