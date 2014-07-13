/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './command', './main-loop', './event-loop', './connection', './util'
], function (command, mainLoop, eventLoop, connection, util) {
    'use strict';

    var onCaptureInitiated;

    onCaptureInitiated = function (settings) {
        var onNoConnection = function () {
            connection.removeEventListener('noConnection',
                                           onNoConnection);
            settings.onFailure();
        };

        connection.addEventListener('noConnection', onNoConnection);

        eventLoop.captureCompleteCallbacks[settings.transactionId] =
            function () {
                connection.removeEventListener('noConnection',
                                               onNoConnection);
                util.runIfSet(settings.onSuccess);
            };
    };

    return function (settings) {
        var onSuccess;

        onSuccess = function (settings2) {
            onCaptureInitiated({
                onFailure: settings.onFailure,
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
