/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(['log', 'ptp.js/ptp'], function (log, ptp) {
    'use strict';

    var onClicked;

    onClicked = function () {
        var ip = document.querySelector('section.connect input').value;

        if (ip === '') {
            log.appendError('Empty IP');
            return;
        }

        log.append('Connecting to ' + ip + '…');
        ptp.ip = ip;
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
