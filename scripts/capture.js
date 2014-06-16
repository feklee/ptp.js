/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './command', './main-loop', './event-loop', './util'
], function (command, mainLoop, eventLoop, util) {
    'use strict';

    var onCaptureInitiated;

    onCaptureInitiated = function (settings) {
        eventLoop.captureCompleteCallbacks[settings.transactionId] =
            function () {
                util.runIfSet(settings.onSuccess);
            };
    };

    return function (settings) {
        var onSuccess;

        onSuccess = function (settings2) {
            onCaptureInitiated({
                onSuccess: settings.onSuccess,
                transactionId: settings2.transactionId
            });
        };

        command.sendCommand({
            operationCode: mainLoop.operationCodes.initiateCapture,
            args: [settings.storageId, settings.objectFormatCode],
            onSuccess: onSuccess,
            onFailure: settings.onFailure
        });
    };
});
