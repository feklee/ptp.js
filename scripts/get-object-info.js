/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './command', './main-loop', './data-factory', './util'
], function (command, mainLoop, dataFactory, util) {
    'use strict';

    var onObjectInfoGotten, readOptionalStrings;

    readOptionalStrings = function (objectInfo, d, offs) {
        var i, string, strings = ['filename',
                                  'captureDate',
                                  'modificationDate',
                                  'keywords'];

        for (i = 0; i < strings.length; i += 1) {
            string = strings[i];
            if (objectInfo.length < offs) {
                return;
            }
            objectInfo[string] = d.getWstring(offs);
            offs += d.getWstringLength(offs);
        }
    };

    onObjectInfoGotten = function (options) {
        var d = options.dataPacket, objectInfo;

        objectInfo = {
            storageId: d.getDword(0),
            objectFormat: d.getWord(4),
            protectionStatus: d.getWord(6),
            objectCompressedSize: d.getDword(8),
            thumbFormat: d.getWord(12),
            thumbCompressedSize: d.getDword(14),
            thumbPixWidth: d.getDword(18),
            thumbPixHeight: d.getDword(22),
            imagePixWidth: d.getDword(26),
            imagePixHeight: d.getDword(30),
            imageBitDepth: d.getDword(34),
            parentObject: d.getDword(38),
            associationType: d.getWord(42),
            associationDesc: d.getDword(44),
            sequenceNumber: d.getDword(48)
        };

        readOptionalStrings(objectInfo, d, 52);

        util.runIfSet(options.onSuccess, {
            objectInfo: objectInfo
        });
    };

    return function (options) {
        var onSuccess, dataPacket = dataFactory.create();

        onSuccess = function () {
            onObjectInfoGotten({
                onSuccess: options.onSuccess,
                dataPacket: dataPacket
            });
        };

        command.sendCommand({
            operationCode: mainLoop.operationCodes.getObjectInfo,
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
