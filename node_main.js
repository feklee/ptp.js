// For loading in Node.js.

/*jslint node: true, maxerr: 50, maxlen: 80 */

/*global define */

var requirejs = require('requirejs'),
    path = require('path'),
    moduleDirname = path.dirname(module.filename);

requirejs.config({
    baseUrl: path.resolve(moduleDirname, 'scripts')
});

module.exports = requirejs('ptp');
