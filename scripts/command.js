/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './packet', './main-loop', './util'
], function (packet, mainLoop, util) {
    'use strict';

    var sendCommand, onCmdResponse, sendPayload, setCallbacks;

    onCmdResponse = function (options) {
        if (options.receivedContent.responseCode ===
                mainLoop.responseCodes.ok) {
            util.runIfSet(options.onSuccess, options);
        } else {
            util.runIfSet(options.onFailure);
        }
    };

    // Returns false on error.
    sendPayload = function (payload) {
        var payloadBlock, scheduleSend = mainLoop.scheduleSend;

        if (!scheduleSend(packet.createStartDataPacket(payload.length))) {
            return false;
        }

        while (true) {
            payloadBlock = payload.shift(200);
            if (payload.length > 0) {
                if (!scheduleSend(packet.createDataPacket(payloadBlock))) {
                    return false;
                }
            } else {
                if (!scheduleSend(packet.createEndDataPacket(payloadBlock))) {
                    return false;
                }
                return true;
            }
        }
    };

    setCallbacks = function (options) {
        mainLoop.cmdResponseCallbacks[packet.transactionId] =
            function (receivedContent) {
                onCmdResponse({
                    onSuccess: options.onSuccess,
                    onFailure: options.onFailure,
                    receivedContent: receivedContent,
                    transactionId: packet.transactionId
                });
            };

        if (options.onStartDataPacket !== undefined) {
            mainLoop.startDataPacketCallbacks[packet.transactionId] =
                options.onStartDataPacket;
        }

        if (options.onDataPacket !== undefined) {
            mainLoop.dataPacketCallbacks[packet.transactionId] =
                options.onDataPacket;
        }

        if (options.onEndDataPacket !== undefined) {
            mainLoop.endDataPacketCallbacks[packet.transactionId] =
                options.onEndDataPacket;
        }
    };

    sendCommand = function (options) {
        var req;

        packet.startNewTransaction();

        req = packet.createCmdRequest(options.operationCode,
                                      options.args);

        if (!mainLoop.scheduleSend(req)) {
            options.onFailure();
            return;
        }

        if (options.payload !== undefined) {
            if (!sendPayload(options.payload)) {
                options.onFailure();
                return;
            }
        }

        setCallbacks(options); // call *after* sending succeeded, to avoid
                                // stale callback entries
    };

    return Object.create(null, {
        sendCommand: {value: sendCommand}
    });
});
