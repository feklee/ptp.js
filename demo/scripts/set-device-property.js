/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(['log', 'ptp.js/ptp'], function (log, ptp) {
    'use strict';

    var onClicked, formattedExposure;

    formattedExposure = function (shift) {
        return ('EV' +
                (shift >= 0 ? '+' : '') +
                (shift / 1000).toFixed(shift % 1000 === 0 ? 0 : 1));
    };

    onClicked = function () {
        var shift; // in stops scaled by a factor of 1000

        shift = document.querySelector('section.set-device-property select').
            value;

        log.append('Setting exposure to ' +
                   formattedExposure(shift) +
                   '…');

        ptp.setDeviceProperty({
            code: ptp.devicePropCodes.exposureBiasCompensation,
            data: ptp.dataFactory.createWord(shift),
            onSuccess: function () {
                log.append('Exposure set');
            },
            onFailure: function () {
                log.appendError('Setting exposure failed');
            }
        });
    };

    document.querySelector('section.set-device-property button').onclick =
        onClicked;
});
