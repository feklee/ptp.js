/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var ptp = require('../..');

module.exports = function () {
    console.log(ptp.dateTimeString({
        date: new Date(),
        appendTimeZone: '+/-hhmm'
    }));
};
