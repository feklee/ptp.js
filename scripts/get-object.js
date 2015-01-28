/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './command', './main-loop', './data-factory', './util'
], function (command, mainLoop, dataFactory, util) {
    'use strict';

    var onObjectGotten;

    onObjectGotten = function (options) {
        util.runIfSet(options.onSuccess, {
            dataPacket: options.dataPacket
        });
    };

    return function (options) {
        var onSuccess, dataPacket = dataFactory.create();

        onSuccess = function () {
            onObjectGotten({
                onSuccess: options.onSuccess,
                dataPacket: dataPacket
            });
        };

        command.sendCommand({
            operationCode: mainLoop.operationCodes.getObject,
            args: [options.objectHandle],
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
