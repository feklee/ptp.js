/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var ptp = require('../..'), util = require('./util'), onConnected;

onConnected = function () {
    console.log('Getting object handles...');

    ptp.getObjectHandles({
        storageId: 0xffffffff, // all stores
        objectFormatCode: 0, // optional
        objectHandleOfAssociation: 0, // optional
        onSuccess: function (options) {
            console.log(options.handles.length === 0 ?
                        'No objects found' :
                        'Handles: ' + options.handles.join(', '));
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
