/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var ptp = require('../..'), util = require('./util'), onConnected;

onConnected = function () {
    var ptp = require('../../node_main');

    console.log('Getting object handles...');

    ptp.getObjectHandles({
        storageId: 0xffffffff, // all stores
        objectFormatCode: 0, // optional
        objectHandleOfAssociation: 0, // optional
        onSuccess: function (options) {
            console.log('Handles: ' + options.dataPacket.array.join(', '));
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
