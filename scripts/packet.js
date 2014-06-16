/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define(['./data-factory'], function (dataFactory) {
    'use strict';

    var types, headerLength = 8, transactionId = 0,
        createInitCommandRequest,
        createInitEventRequest,
        createCmdRequest,
        createStartDataPacket,
        createDataPacket,
        createEndDataPacket,
        startNewTransaction,
        parse,
        setHeader,
        parsers = {}; // by packet type

    types = {
        initCommandRequest: 1,
        initCommandAck: 2,
        initEventRequest: 3,
        initEventAck: 4,
        initFail: 5,
        cmdRequest: 6,
        cmdResponse: 7,
        event: 8,
        startDataPacket: 9,
        dataPacket: 10,
        cancelTransaction: 11,
        endDataPacket: 12,
        ping: 13,
        pong: 14
    };

    Object.freeze(types);

    parsers[types.initCommandAck] = function (data) {
        return {
            sessionId: data.getDword(headerLength)
        };
    };

    parsers[types.initEventAck] = function () {
        return {}; // no payload
    };

    parsers[types.initFail] = function (data) {
        return {
            errorCode: data.getDword(headerLength)
        };
    };

    parsers[types.event] = function (data) {
        return {
            eventCode: data.getWord(headerLength),
            parameters: [
                data.getDword(headerLength + 2),
                data.getDword(headerLength + 6),
                data.getDword(headerLength + 10)
            ]
        };
    };

    parsers[types.cmdResponse] = function (data) {
        return {
            responseCode: data.getWord(headerLength),
            transactionId: data.getDword(headerLength + 2),
            argsData: data.remainder(headerLength + 6)
        };
    };

    parsers[types.startDataPacket] = function (data) {
        return {
            transactionId: data.getDword(headerLength),
            dataSize: data.getDword(headerLength + 4) // without headers
        };
    };

    parsers[types.dataPacket] = function (data) {
        return {
            transactionId: data.getDword(headerLength),
            payloadData: data.remainder(headerLength + 4)
        };
    };

    parsers[types.endDataPacket] = function (data) {
        return {
            transactionId: data.getDword(headerLength),
            payloadData: data.remainder(headerLength + 4)
        };
    };

    setHeader = function (data, type) {
        data.setDword(0, data.length);
        data.setDword(4, type);
    };

    // Returns false on error.
    parse = function (data) {
        var content = {}, type, parser;

        if (data.length < 8) {
            return false; // not enough data, should not happen
        }

        type = data.getWord(4);
        parser = parsers[type];

        if (parser !== undefined) {
            content = parser(data);
        } else {
            content = {
                unparsedData: data
            };
        }

        content.type = type;

        return content;
    };

    // Quote from the "White Paper of CIPA DC-005-2005": "[...] the Initiator
    // sends the *Init Command Request* PTP-IP packet that contains its identity
    // (GUID and Friendly Name).
    //
    // `guid` is a 16 byte array. It is cut off is longer, or zero padded if
    // shorter.
    createInitCommandRequest = function (guid, name) {
        var data = dataFactory.create(), i, x,
            maxLen = 80; // arbitrary limit, possibly could be longer

        for (i = 0; i < 16; i += 1) {
            x = (guid[i] === undefined) ? 0 : guid[i];
            data.setByte(headerLength + i, x);
        }

        data.appendWstring(name.slice(0, maxLen));
        data.appendDword(1);

        setHeader(data, types.initCommandRequest);

        return data;
    };

    createInitEventRequest = function (sessionId) {
        var data = dataFactory.create();
        data.setDword(headerLength, sessionId);
        setHeader(data, types.initEventRequest);
        return data;
    };

    createCmdRequest = function (commandCode, args) {
        var data = dataFactory.create();

        data.setDword(headerLength, 1);
        data.appendWord(commandCode);
        data.appendDword(transactionId);

        if (args !== undefined) {
            args.forEach(function (arg) {
                data.appendDword(arg);
            });
        }

        setHeader(data, types.cmdRequest);

        return data;
    };

    createStartDataPacket = function (size) {
        var data = dataFactory.create();

        data.setDword(headerLength, transactionId);
        data.appendDword(size);

        setHeader(data, types.startDataPacket);

        return data;
    };

    createDataPacket = function (payloadData) {
        var data = dataFactory.create();

        data.setDword(headerLength, transactionId);
        data.appendData(payloadData);

        setHeader(data, types.dataPacket);

        return data;
    };

    createEndDataPacket = function (payloadData) {
        var data = dataFactory.create();

        data.setDword(headerLength, transactionId);
        data.appendData(payloadData);

        setHeader(data, types.endDataPacket);

        return data;
    };

    startNewTransaction = function () {
        transactionId += 1;
    };

    return Object.create(null, {
        createInitCommandRequest: {value: createInitCommandRequest},
        createInitEventRequest: {value: createInitEventRequest},
        createCmdRequest: {value: createCmdRequest},
        createStartDataPacket: {value: createStartDataPacket},
        createDataPacket: {value: createDataPacket},
        createEndDataPacket: {value: createEndDataPacket},
        startNewTransaction: {value: startNewTransaction},
        types: {get: function () { return types; }},
        parse: {value: parse},
        transactionId: {get: function () { return transactionId; }}
    });
});
