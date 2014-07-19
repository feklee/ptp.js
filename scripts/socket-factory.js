/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(['./mozilla-socket-factory'], function (mozillaSocketFactory) {
    'use strict';

    var implementation = mozillaSocketFactory; // default

    return implementation;
});
