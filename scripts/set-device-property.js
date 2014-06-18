/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(['./command', './main-loop'], function (command, mainLoop) {
    'use strict';

    // Returns false iff sending property could not be requested.
    return function (settings) {
        return command.sendCommand({
            operationCode: mainLoop.operationCodes.setDevicePropValue,
            args: [settings.code],
            payload: settings.data,
            onSuccess: settings.onSuccess,
            onFailure: settings.onFailure
        });
    };
});
