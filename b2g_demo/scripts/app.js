/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    'ptp.js/ptp', 'log', 'connect', 'capture', 'set-device-property',
    'get-device-property', 'date-time-string'
], function (ptp, log) {
    'use strict';

    ptp.onNoConnection = function () {
        log.appendError('No connection');
    };

    ptp.onError = function (msg) {
        log.appendError(msg);
    };
});
