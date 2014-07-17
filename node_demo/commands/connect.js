/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

module.exports = function (settings) {
    var ptp = settings.ptp;

    console.log('Connecting to ' + settings.host + '…');
    ptp.ip = settings.host;
    ptp.clientName = 'ptp.js demo';
    ptp.loggerOutputIsEnabled = true;
    // additional optional parameters: `port`, `clientGuid`
    ptp.onConnected = function () {
        console.log('Connected');
        settings.onConnected();
    };
    ptp.connect();
};
