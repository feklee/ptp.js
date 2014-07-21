/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var ptp = require('../../node_main');

module.exports = function (deviceProperty) {
    ptp.getDeviceProperty({
        code: ptp.devicePropCodes[deviceProperty],
        onSuccess: function (options) {
            console.log('Value: ' + options.dataPacket.toString());
        },
        onFailure: function () {
            console.error('Failed');
        }
    });

    console.log('Getting ' + deviceProperty + '…');
};
