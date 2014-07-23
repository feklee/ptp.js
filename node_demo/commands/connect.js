/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

module.exports = function (options) {
    var ptp = require('../..');

    console.log('Connecting to ' + options.host + '...');
    ptp.host = options.host;
    ptp.clientName = 'ptp.js demo';
    // additional optional parameters: `port`, `clientGuid`
    ptp.onDisconnected = function () {
        console.log('Disconnected');
    };
    ptp.onError = function (msg) {
        console.error(msg);
    };
    ptp.onConnected = function () {
        console.log('Connected');
        options.onConnected();
    };
    ptp.connect();
};
