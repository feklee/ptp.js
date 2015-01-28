Introduction
============

*ptp.js* is a JavaScript library providing *limited* functionality for
controlling cameras via [PTP][1]/IP: *Picture Transfer Protocol* via an
IP-based network

The first version of the library was developed by [Felix][3] for interfacing
with a [Ricoh Theta][2]. On Firefox Marketplace you find the result:
[Theta Control][13]

An inspiration was `ThetaShutterProc.c`, a set of C functions part of
[ThetaShutter_PQIAirPen002.zip][6] by [MobileHackerz][4]. *ptp.js* has a
different architecture, however, making use of JavaScript’s functional nature.


Documentation
=============

Basic usage:

 1. Load the module, depending on platform:

      + B2G ([TCP Socket API][8]): AMD module `scripts/ptp.js`

      + Node.js module

    An object is created, let’s call it `ptp`.

 2. Interface with the camera via properties such as `ptp.host` and functions
    such as `ptp.connect()`.

For an example, see demos:

  + B2G: Firefox OS app (`manifest.webapp`)

  + Node.js: `node_demo/app.js`

    Note for Windows users: Due to Node.js [issue #3584][14], output may be
    missing when using redirection, for example with `more`.


Limitations
===========

  * Incompleteness: Many PTP functions are missing.

  * Only tested with one camera, the Ricoh Theta.


Development
===========

Module graph as of 2014-06-19 CEST
----------------------------------

Module graph created with `madge --image graph.png --exclude
"util|logger|connection-settings" --format amd scripts`, then annotated:

![Annotated graph][12]

Coding conventions
------------------

  * Code needs to validate with JSLint.

  * Comments are in Markdown.

  * Don’t use constructors: JavaScript is a classless language.

  * Don’t throw exceptions. JavaScript is a weakly typed language, allowing
    functions to return different types of values, including types indicating
    errors.

  * Version numbers: [major.minor.patch][7]

Publishing a new version
------------------------

  * Keep version up to date in:

      + Git tags

      + `package.json`

  * Publish to:

      + [github.com/feklee/ptp.js][15]

      + npm: [package ptp][16]

Reading
-------

  * [2000-07-05 PTP specification][9]

  * [gPhoto PTP/IP documentation][10]

  * [White Paper of CIPA DC-005-2005][11] (PTP/IP)


License
=======

Except where noted otherwise, files are licensed under the MIT License.


The MIT License (MIT)
---------------------

Copyright (c) 2014 authors of ptp.js

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[1]: http://en.wikipedia.org/wiki/Picture_Transfer_Protocol
[2]: http://en.wikipedia.org/wiki/Ricoh
[3]: mailto:felix.klee@inka.de
[4]: http://mobilehackerz.jp/contents/Review/RICOH_THETA
[6]: http://mobilehackerz.jp/contents?plugin=attach&pcmd=info&file=ThetaShutter_PQIAirPen002.zip&refer=Review%2FRICOH_THETA%2FRemote
[7]: http://semver.org/
[8]: https://developer.mozilla.org/en-US/docs/WebAPI/TCP_Socket
[9]: http://people.ece.cornell.edu/land/courses/ece4760/FinalProjects/f2012/jmv87/site/files/pima15740-2000.pdf
[10]: http://www.gphoto.org/doc/ptpip.php
[11]: http://www.cipa.jp/ptp-ip/documents_e/CIPA_DC-005_Whitepaper_ENG.pdf
[12]: images/2014-06-19+02_annotated_graph.png?raw=true
[13]: https://marketplace.firefox.com/app/theta-control
[14]: https://github.com/joyent/node/issues/3584
[15]: https://github.com/feklee/ptp.js
[16]: https://www.npmjs.com/package/ptp
