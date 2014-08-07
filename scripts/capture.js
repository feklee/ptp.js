/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './command', './main-loop', './event-loop', './connection', './util'
], function (command, mainLoop, eventLoop, connection, util) {
    'use strict';

    var onCaptureInitiated;

    onCaptureInitiated = function (options) {
        var onDisconnected = function () {
            connection.removeEventListener('disconnected',
                                           onDisconnected);
            options.onFailure();
        };

        connection.addEventListener('disconnected', onDisconnected);

        eventLoop.captureCompleteCallbacks[options.transactionId] =
            function () {
                connection.removeEventListener('disconnected',
                                               onDisconnected);
                util.runIfSet(options.onSuccess);
            };
    };

    return function (options) {
        var onSuccess;

        onSuccess = function (options2) {
            onCaptureInitiated({
                onFailure: options.onFailure,
                onSuccess: options.onSuccess,
                transactionId: options2.transactionId
            });
        };

        command.sendCommand({
            operationCode: mainLoop.operationCodes.initiateCapture,
            args: [options.storageId, options.objectFormatCode],
            onSuccess: onSuccess,
            onFailure: options.onFailure
        });
    };
});
