/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(function () {
    'use strict';

    var append, appendError;

    append = function (msg) {
        document.querySelector('section.log p').innerHTML += '<br/>' + msg;
    };

    appendError = function (msg) {
        append('<span class="error">' + msg + '</span>');
    };

    return Object.create(null, {
        append: {value: append},
        appendError: {value: appendError}
    });
});
