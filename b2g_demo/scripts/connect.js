/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(['log', 'ptp.js/ptp'], function (log, ptp) {
    'use strict';

    var onClicked;

    onClicked = function () {
        var host = document.querySelector('section.connect input').value;

        if (host === '') {
            log.appendError('Empty host');
            return;
        }

        log.append('Connecting to ' + host + '…');
        ptp.host = host;
        ptp.clientName = 'ptp.js demo';
        ptp.loggerOutputIsEnabled = true;
        // additional optional parameters: `port`, `clientGuid`
        ptp.onConnected = function () {
            log.append('Connected');
        };
        ptp.connect();
    };

    document.querySelector('section.connect button').onclick = onClicked;
});
