/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './command', './main-loop', './data-factory', './util'
], function (command, mainLoop, dataFactory, util) {
    'use strict';

    var onObjectDeleted;

    onObjectDeleted = function (options) {
        util.runIfSet(options.onSuccess, {
            dataPacket: options.dataPacket
        });
    };

    return function (options) {
        var onSuccess, dataPacket = dataFactory.create();

        onSuccess = function (options2) {
            onObjectDeleted({
                onSuccess: options.onSuccess,
                transactionId: options2.transactionId,
                argsData: options2.receivedContent.argsData,
                dataPacket: dataPacket
            });
        };

        command.sendCommand({
            operationCode: mainLoop.operationCodes.deleteObject,
            args: [options.objectId],
            payload: options.data,
            onDataPacket: function (packetContent) {
                dataPacket.appendData(packetContent.payloadData);
            },
            onEndDataPacket: function (packetContent) {
                dataPacket.appendData(packetContent.payloadData);
            },
            onSuccess: onSuccess,
            onFailure: options.onFailure
        });
    };
});
