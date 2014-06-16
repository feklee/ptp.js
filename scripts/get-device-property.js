/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './command', './main-loop', './data-factory', './util'
], function (command, mainLoop, dataFactory, util) {
    'use strict';

    var onDevicePropertyGot;

    onDevicePropertyGot = function (settings) {
        util.runIfSet(settings.onSuccess, {
            dataPacket: settings.dataPacket
        });
    };

    return function (settings) {
        var onSuccess, dataPacket = dataFactory.create();

        onSuccess = function (settings2) {
            onDevicePropertyGot({
                onSuccess: settings.onSuccess,
                transactionId: settings2.transactionId,
                argsData: settings2.receivedContent.argsData,
                dataPacket: dataPacket
            });
        };

        command.sendCommand({
            operationCode: mainLoop.operationCodes.getDevicePropValue,
            args: [settings.code],
            payload: settings.data,
            onDataPacket: function (packetContent) {
                dataPacket.appendData(packetContent.payloadData);
            },
            onEndDataPacket: function (packetContent) {
                dataPacket.appendData(packetContent.payloadData);
            },
            onSuccess: onSuccess,
            onFailure: settings.onFailure
        });
    };
});
