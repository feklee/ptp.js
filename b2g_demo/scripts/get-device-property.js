/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(['log', 'ptp.js/ptp'], function (log, ptp) {
    'use strict';

    var onClicked;

    onClicked = function () {
        log.append('Getting battery level…');

        ptp.getDeviceProperty({
            code: ptp.devicePropCodes.batteryLevel,
            onSuccess: function (options) {
                log.append('Got battery level (hex): ' +
                           options.dataPacket.toString());
            },
            onFailure: function () {
                log.appendError('Getting battery level failed');
            }
        });
    };

    document.querySelector('section.get-device-property button').onclick =
        onClicked;
});
