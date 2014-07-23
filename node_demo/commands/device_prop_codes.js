/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var ptp = require('../..'), lengthOfLongestKey,
    util = require('./util');

lengthOfLongestKey = function (keys) {
    return keys.reduce(function (length, key) {
        return Math.max(length, key.length);
    }, 0);
};

module.exports = function () {
    var codes = ptp.devicePropCodes, keys = Object.keys(ptp.devicePropCodes),
        l = lengthOfLongestKey(keys);

    keys.forEach(function (key) {
        console.log(util.pad(key, l) + '  0x' + codes[key].toString(16));
    });
    console.log('');
    console.log('Device may not support all properties. ' +
                'For details, see 2000-07-05 PTP specs:');
    console.log('');
    console.log('<url:http://people.ece.cornell.edu/land/courses/ece4760/');
    console.log('FinalProjects/f2012/jmv87/site/files/pima15740-2000.pdf>');
};
