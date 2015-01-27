/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var util = require('./util'), ptp = require('../..'),
    fs = require('fs'),
    onConnected,
    onObjectGotten;

onObjectGotten = function (dataPacket, filename) {
    fs.writeFile(
        filename,
        dataPacket.buffer,
        function (err) {
            if (err) {
                console.log('Failed: ', err);
            } else {
                console.log('Saved to ' + filename);
            }
        }
    );
};

onConnected = function (objectHandle, filename) {
    console.log('Getting object ' + objectHandle + '...');

    ptp.getObject({
        objectHandle: objectHandle,
        onSuccess: function (options) {
            onObjectGotten(options.dataPacket, filename);
            ptp.disconnect();
        },
        onFailure: function () {
            console.error('Failed');
            ptp.disconnect();
        }
    });
};

module.exports = function (host, objectHandle, filename) {
    require('./connect')({
        host: host,
        onConnected: onConnected.bind(this, objectHandle, filename)
    });
};
