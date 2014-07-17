/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(['log', 'ptp.js/ptp'], function (log, ptp) {
    'use strict';

    var onClicked;

    onClicked = function () {
        ptp.capture({
            storageId: 0, // optional
            objectFormatCode: 0, // optional
            onSuccess: function () {
                log.append('Capturing finished');
            },
            onFailure: function () {
                log.appendError('Capturing failed');
            }
        });

        log.append('Capturing…');
    };

    document.querySelector('section.capture button').onclick = onClicked;
});
