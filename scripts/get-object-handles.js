/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './command', './main-loop', './data-factory', './util'
], function (command, mainLoop, dataFactory, util) {
    'use strict';

    var onObjectHandlesGotten;

    onObjectHandlesGotten = function (options) {
        util.runIfSet(options.onSuccess, {
            handles: options.dataPacket.dwordArray.splice(2)
        });
    };

    return function (options) {
        var onSuccess, dataPacket = dataFactory.create();

        onSuccess = function () {
            onObjectHandlesGotten({
                onSuccess: options.onSuccess,
                dataPacket: dataPacket
            });
        };

        command.sendCommand({
            operationCode: mainLoop.operationCodes.getObjectHandles,
            args: [options.storageId,
                   options.objectFormatCode || 0,
                   options.objectHandleOfAssociation || 0],
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
