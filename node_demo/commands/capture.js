/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var ptp = require('../../node_main');

module.exports = function () {
    ptp.capture({
        storageId: 0, // optional
        objectFormatCode: 0, // optional
        onSuccess: function () {
            console.log('Finished');
        },
        onFailure: function () {
            console.error('Failed');
        }
    });

    console.log('Capturing…');
};
