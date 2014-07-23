/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var ptp = require('../..'), pad, prettyPrintDeviceProperty;

pad = function (s, width) {
    var len = Math.max(0, width - s.length);
    return s + new Array(len + 1).join(' ');
};

// If available, returns the name associated with the property, as in the
// 2000-07-05 PTP specification.
prettyPrintDeviceProperty = function (code) {
    var name, codes = ptp.devicePropCodes;

    name = Object.keys(ptp.devicePropCodes).filter(function (key) {
        return codes[key] === code;
    })[0];

    return name || '0x' + code.toString(16);
};

module.exports = Object.create(null, {
    pad: {value: pad},
    prettyPrintDeviceProperty: {value: prettyPrintDeviceProperty}
});
