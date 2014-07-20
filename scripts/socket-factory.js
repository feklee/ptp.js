/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './mozilla-socket-factory', './node-socket-factory'
], function (mozillaSocketFactory, nodeSocketFactory) {
    'use strict';

    var implementation;

    if (typeof window === 'object') {
        implementation = mozillaSocketFactory;
    } else {
        implementation = nodeSocketFactory;
    }

    return implementation;
});
