/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(['log', 'ptp.js/ptp'], function (log, ptp) {
    'use strict';

    var onClicked;

    onClicked = function () {
        var string = ptp.dateTimeString({
            date: new Date(),
            appendTimeZone: '+/-hhmm'
        });
        log.append('PTP DateTime string: ' + string);
    };

    document.querySelector('section.date-time-string button').onclick =
        onClicked;
});
