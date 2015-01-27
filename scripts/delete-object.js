/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './command', './main-loop'
], function (command, mainLoop) {
    'use strict';

    return function (options) {
        command.sendCommand({
            operationCode: mainLoop.operationCodes.deleteObject,
            args: [options.objectHandle,
                   options.objectFormatCode || 0],
            onSuccess: options.onSuccess,
            onFailure: options.onFailure
        });
    };
});
