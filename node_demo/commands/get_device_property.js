/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var ptp = require('../..'), util = require('./util'), onConnected;

onConnected = function (propCode) {
    var code, ptp = require('../../node_main');

    /*jslint evil: true */
    code = eval(propCode);
    /*jslint evil: false */

    console.log('Getting ' + util.prettyPrintDeviceProperty(code) + '...');

    ptp.getDeviceProperty({
        code: code,
        onSuccess: function (options) {
            console.log('Value (hex): ' + options.dataPacket.toString());
            ptp.disconnect();
        },
        onFailure: function () {
            console.error('Failed');
            ptp.disconnect();
        }
    });
};

module.exports = function (host, propCode) {
    require('./connect')({
        host: host,
        onConnected: onConnected.bind(this, propCode)
    });
};
