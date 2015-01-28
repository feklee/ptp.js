/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var ptp = require('../..'), util = require('./util'), onConnected;

onConnected = function (objectHandle) {
    console.log('Getting info for object ' + objectHandle + '...');

    ptp.getObjectInfo({
        objectHandle: objectHandle,
        onSuccess: function (options) {
            console.log(options.objectInfo);

            switch (options.objectInfo.objectFormat) {
            case ptp.objectFormatCodes.association:
                console.log('Association (e.g. folder)');
                break;
            case ptp.objectFormatCodes.exifJpeg:
                console.log('JPEG file');
                break;
            }

            ptp.disconnect();
        },
        onFailure: function () {
            console.error('Failed');
            ptp.disconnect();
        }
    });
};

module.exports = function (host, objectHandle) {
    require('./connect')({
        host: host,
        onConnected: onConnected.bind(this, objectHandle)
    });
};
