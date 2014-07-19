/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(function () {
    'use strict';

    var log, outputIsEnabled = false;

    log = function () {
        if (outputIsEnabled) {
            window.console.log.apply(window.console, arguments);
        }
    };

    return Object.create(null, {
        log: {value: log},
        outputIsEnabled: {
            set: function (x) {
                outputIsEnabled = x;
            },
            get: function () {
                return outputIsEnabled;
            }
        }
    });
});
