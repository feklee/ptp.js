/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var ptp = require('../..'), onConnected;

onConnected = function () {
    console.log('Capturing...');
    ptp.capture({
        storageId: 0, // optional
        objectFormatCode: 0, // optional
        onSuccess: function () {
            console.log('Finished');
            ptp.disconnect();
        },
        onFailure: function () {
            console.error('Failed');
            ptp.disconnect();
        }
    });
};

module.exports = function (host) {
    require('./connect')({
        host: host,
        onConnected: onConnected
    });
};
