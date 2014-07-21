// Creates interfaces to TCP sockets, with implementation depending on platform.

/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './mozilla-socket-factory', './node-socket-factory', './util'
], function (mozillaSocketFactory, nodeSocketFactory, util) {
    'use strict';

    var implementation;

    if (util.isRunningInBrowser) {
        implementation = mozillaSocketFactory;
    } else {
        implementation = nodeSocketFactory;
    }

    return implementation;
});
