Introduction
============

*ptp.js* is a JavaScript library providing *limited* functionality for
controlling cameras via [PTP][1]/IP: *Picture Transfer Protocol* via an
IP-based network

*ptp.js* was initially written by [Felix][3] for remote controlling a
[Ricoh Theta][2]. The library was inspired by `ThetaShutterProc.c`, a set of C
functions part of [ThetaShutter_PQIAirPen002.zip][6] by [MobileHackerz][4].
*ptp.js* has a different architecture, however, making use of JavaScript’s
functional programming features.


Documentation
=============

Basic usage:

 1. Load the AMD module `scripts/ptp.js`. An object is created, let’s call it
    `ptp`.

 2. Interface with the camera via properties such as `ptp.ip` and functions such
    as `ptp.connect()`.

For an example, see the packaged demo app for Firefox OS: `manifest.webapp`


Limitations
===========

  * Incompleteness: Many PTP functions are missing.

  * Only tested with the Ricoh Theta.

  * There is no provision, such as a command queue, for devices that cannot
    process two PTP/IP commands concurrently.


Requirements
============

  * [RequireJS][7]

  * [TCPSocket API][8], available on Firefox OS 1.x via `navigator.mozTCPSocket`


Development
===========

Coding conventions
------------------

  * Code needs to validate with JSLint.

  * Comments are in Markdown.

  * Don’t use constructors: JavaScript is a classless language.

  * Don’t throw exceptions. JavaScript is a weakly typed language, allowing
    functions to return different types of values, including types indicating
    errors.

  * Versioning: major.minor.bug-fix

    Incompatible changes to the API mandate an update of the major version.

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
this software and associated documentation files (the "Software"), to deal in
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
[6]: http://mobilehackerz.jp/contents?plugin=attach&pcmd=info&file=ThetaShutter_PQIAirPen002.zip&refer=Review%2FRICOH*THETA%2FRemote
[7]: http://requirejs.org/
[8]: https://developer.mozilla.org/en-US/docs/WebAPI/TCP*Socket
[9]: http://people.ece.cornell.edu/land/courses/ece4760/FinalProjects/f2012/jmv87/site/files/pima15740-2000.pdf
[10]: http://www.gphoto.org/doc/ptpip.php
[11]: http://www.cipa.jp/ptp-ip/documents_e/CIPA_DC-005_Whitepaper_ENG.pdf
