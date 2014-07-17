/*jslint node: true, maxerr: 50, maxlen: 80 */

var ptp = require('../../node_main');

ptp.capture({
    storageId: 0, // optional
    objectFormatCode: 0, // optional
    onSuccess: function () {
        console.error('Capturing finished');
    },
    onFailure: function () {
        console.error('Capturing failed');
    }
});

console.log('Capturing…');
