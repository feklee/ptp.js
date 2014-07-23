/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var ptp = require('../..'), util = require('./util'), onConnected;

onConnected = function (propCode, value) {
    var code, data, ptp = require('../../node_main');

    /*jslint evil: true */
    code = eval(propCode);
    data = eval('ptp.dataFactory.' + value);
    /*jslint evil: false */

    console.log('Setting ' + util.prettyPrintDeviceProperty(code) + ' to ' +
                data.toString() + '...');

    ptp.setDeviceProperty({
        code: code,
        data: data,
        onSuccess: function () {
            console.log('Set');
            ptp.disconnect();
        },
        onFailure: function () {
            console.error('Failed');
            ptp.disconnect();
        }
    });
};

module.exports = function (host, propCode, value) {
    require('./connect')({
        host: host,
        onConnected: onConnected.bind(this, propCode, value)
    });
};
