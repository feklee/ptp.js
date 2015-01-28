/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define, Uint8Array */

define(['./packet', './loop-factory'], function (packet, loopFactory) {
    'use strict';

    var onInitialized,
        clientGuid = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        clientName = '',
        operationCodes,
        cmdResponseCallbacks = {}, // by transaction ID
        startDataPacketCallbacks = {}, // by transaction ID
        dataPacketCallbacks = {}, // by transaction ID
        endDataPacketCallbacks = {}, // by transaction ID
        loop = loopFactory.create('main'),
        sessionId,
        openSession,
        onSessionOpened;

    operationCodes = {
        'undefined': 0x1000,
        getDeviceInfo: 0x1001,
        openSession: 0x1002,
        closeSession: 0x1003,
        getStorageIds: 0x1004,
        getStorageInfo: 0x1005,
        getNumObjects: 0x1006,
        getObjectHandles: 0x1007,
        getObjectInfo: 0x1008,
        getObject: 0x1009,
        getThumb: 0x100a,
        deleteObject: 0x100b,
        sendObjectInfo: 0x100c,
        sendObject: 0x100d,
        initiateCapture: 0x100e,
        formatStore: 0x100f,
        resetDevice: 0x1010,
        selfTest: 0x1011,
        setObjectProtection: 0x1012,
        powerDown: 0x1013,
        getDevicePropDesc: 0x1014,
        getDevicePropValue: 0x1015,
        setDevicePropValue: 0x1016,
        resetDevicePropValue: 0x1017,
        terminateOpenCapture: 0x1018,
        moveObject: 0x1019,
        copyObject: 0x101a,
        getPartialObject: 0x101b,
        initiateOpenCapture: 0x101c
    };

    Object.freeze(operationCodes);

    loop.onDataCallbacks[packet.types.initCommandAck] = function (content) {
        sessionId = content.sessionId;
        onInitialized();
    };

    openSession = function () {
        cmdResponseCallbacks[packet.transactionId] = function (content) {
            if (content.responseCode === loop.responseCodes.ok) {
                onSessionOpened();
            }
        };
        loop.scheduleSend(packet.createCmdRequest(operationCodes.openSession,
                                                  [sessionId]));
    };

    loop.onSocketOpened = function () {
        loop.scheduleSend(packet.createInitCommandRequest(clientGuid,
                                                          clientName));
    };

    loop.onDataCallbacks[packet.types.cmdResponse] = function (content) {
        var callback = cmdResponseCallbacks[content.transactionId];

        if (callback !== undefined) {
            callback(content);
            delete cmdResponseCallbacks[content.transactionId];
        }
    };

    loop.onDataCallbacks[packet.types.startDataPacket] = function (content) {
        var callback = startDataPacketCallbacks[content.transactionId];

        if (callback !== undefined) {
            callback(content);
            delete startDataPacketCallbacks[content.transactionId];
        }
    };

    loop.onDataCallbacks[packet.types.dataPacket] = function (content) {
        var callback = dataPacketCallbacks[content.transactionId];

        if (callback !== undefined) {
            callback(content);
        }
    };

    loop.onDataCallbacks[packet.types.endDataPacket] = function (content) {
        var callback = endDataPacketCallbacks[content.transactionId];

        if (callback !== undefined) {
            callback(content);
            delete endDataPacketCallbacks[content.transactionId];
        }
        delete dataPacketCallbacks[content.transactionId];
    };

    return Object.create(null, {
        initialize: {value: loop.openSocket},
        onInitialized: {set: function (x) {
            onInitialized = x;
        }},
        onDisconnected: {set: function (x) {
            loop.onDisconnected = x;
        }},
        onError: {set: function (x) {
            loop.onError = x;
        }},
        scheduleSend: {value: loop.scheduleSend},
        clientGuid: {set: function (x) {
            clientGuid = x;
        }},
        clientName: {set: function (x) {
            clientName = x;
        }},
        sessionId: {get: function () {
            return sessionId;
        }},
        onSessionOpened: {set: function (x) {
            onSessionOpened = x;
        }},
        openSession: {value: openSession},
        operationCodes: {get: function () {
            return operationCodes;
        }},
        responseCodes: {get: function () {
            return loop.responseCodes;
        }},
        cmdResponseCallbacks: {get: function () {
            return cmdResponseCallbacks;
        }},
        startDataPacketCallbacks: {get: function () {
            return startDataPacketCallbacks;
        }},
        dataPacketCallbacks: {get: function () {
            return dataPacketCallbacks;
        }},
        endDataPacketCallbacks: {get: function () {
            return endDataPacketCallbacks;
        }},
        stop: {value: loop.stop}
    });
});
