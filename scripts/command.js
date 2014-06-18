/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './packet', './main-loop', './util'
], function (packet, mainLoop, util) {
    'use strict';

    var sendCommand, onCmdResponse, devicePropCodes, sendPayload,
        setCallbacks;

    devicePropCodes = {
        'undefined': 0x5000,
        batteryLevel: 0x5001,
        functionalMode: 0x5002,
        imageSize: 0x5003,
        compressionSetting: 0x5004,
        whiteBalance: 0x5005,
        rgbGain: 0x5006,
        fNumber: 0x5007,
        focalLength: 0x5008,
        focusDistance: 0x5009,
        focusMode: 0x500a,
        exposureMeteringMode: 0x500b,
        flashMode: 0x500c,
        exposureTime: 0x500d,
        exposureProgramMode: 0x500e,
        exposureIndex: 0x500f,
        exposureBiasCompensation: 0x5010,
        dateTime: 0x5011,
        captureDelay: 0x5012,
        stillCaptureMode: 0x5013,
        contrast: 0x5014,
        sharpness: 0x5015,
        digitalZoom: 0x5016,
        effectMode: 0x5017,
        burstNumber: 0x5018,
        burstInterval: 0x5019,
        timelapseNumber: 0x501a,
        timelapseInterval: 0x501b,
        focusMeteringMode: 0x501c,
        uploadURL: 0x501d,
        artist: 0x501e,
        copyrightInfo: 0x501f
    };
    Object.freeze(devicePropCodes);

    onCmdResponse = function (settings) {
        if (settings.receivedContent.responseCode ===
                mainLoop.responseCodes.ok) {
            util.runIfSet(settings.onSuccess, settings);
        } else {
            util.runIfSet(settings.onFailure);
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

    setCallbacks = function (settings) {
        mainLoop.cmdResponseCallbacks[packet.transactionId] =
            function (receivedContent) {
                onCmdResponse({
                    onSuccess: settings.onSuccess,
                    onFailure: settings.onFailure,
                    receivedContent: receivedContent,
                    transactionId: packet.transactionId
                });
            };

        if (settings.onStartDataPacket !== undefined) {
            mainLoop.startDataPacketCallbacks[packet.transactionId] =
                settings.onStartDataPacket;
        }

        if (settings.onDataPacket !== undefined) {
            mainLoop.dataPacketCallbacks[packet.transactionId] =
                settings.onDataPacket;
        }

        if (settings.onEndDataPacket !== undefined) {
            mainLoop.endDataPacketCallbacks[packet.transactionId] =
                settings.onEndDataPacket;
        }
    };

    sendCommand = function (settings) {
        var req;

        packet.startNewTransaction();

        req = packet.createCmdRequest(settings.operationCode,
                                      settings.args);

        if (!mainLoop.scheduleSend(req)) {
            settings.onFailure();
            return;
        }

        if (settings.payload !== undefined) {
            if (!sendPayload(settings.payload)) {
                settings.onFailure();
                return;
            }
        }

        setCallbacks(settings); // call *after* sending succeeded, to avoid
                                // stale callback entries
    };

    return Object.create(null, {
        sendCommand: {value: sendCommand},
        devicePropCodes: {get: function () {
            return devicePropCodes;
        }}
    });
});
