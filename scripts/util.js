/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(function () {
    'use strict';

    var nop, extend, runIfSet, withFirstCharCapitalized, dateTimeString,
        zeroPad, timeZoneString;

    nop = function () {
        return;
    };

    // Copies properties from `source` into `destination`, and returns
    // `destination`.
    extend = function (destination, source) {
        var prop;
        for (prop in source) {
            if (source.hasOwnProperty(prop)) {
                destination[prop] = source[prop];
            }
        }
        return destination;
    };

    runIfSet = function (f) {
        if (typeof f === 'function') {
            var args = Array.prototype.slice.call(arguments, 1);
            return f.apply(this, args);
        }
    };

    withFirstCharCapitalized = function (s) {
        return (s.length > 0 ?
                s.charAt(0).toUpperCase() + s.slice(1) :
                '');
    };

    zeroPad = function (x) {
        return (x < 10 ? '0' : '') + x;
    };

    timeZoneString = function (d) {
        var mins = -d.getTimezoneOffset(),
            amins = Math.abs(mins);

        return ((mins > 0 ? '+' : '-') +
                zeroPad(Math.floor(amins / 60)) +
                zeroPad(amins % 60));
    };

    // PTP date string from JavaScript date object
    dateTimeString = function (settings) {
        var d = settings.date, s;
        s = d.getFullYear() +
            zeroPad(d.getMonth() + 1) +
            zeroPad(d.getDate()) +
            'T' +
            zeroPad(d.getHours()) +
            zeroPad(d.getMinutes()) +
            zeroPad(d.getSeconds()) +
            '.' +
            Math.round(d.getMilliseconds() / 100);

        if (settings.appendTimeZone === 'Z') {
            return s + 'Z';
        }

        if (settings.appendTimeZone === '+/-hhmm') {
            return s + timeZoneString(d);
        }

        return s;
    };

    return Object.create(null, {
        nop: {value: nop},
        extend: {value: extend},
        runIfSet: {value: runIfSet},
        withFirstCharCapitalized: {value: withFirstCharCapitalized},
        dateTimeString: {value: dateTimeString}
    });
});
