/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define, Uint8Array */

define([
    './packet', './util', './logger', './socket-factory'
], function (packet, util, logger, socketFactory) {
    'use strict';

    var create, internalProto = {}, proto = {};

    proto.responseCodes = {
        ok: 0x2001
    };

    Object.freeze(proto.responseCodes);

    internalProto.logMsg = function (msg) {
        logger.log(util.withFirstCharCapitalized(this.name) + ' loop: ' +
                   msg);
    };

    internalProto.loggedSend = function (data) {
        var ret = this.socket.send(data);
        this.logMsg('Sent: ' + data.toString());
        return ret;
    };

    // Parses incoming PTP/IP packets (there may be several fused), and - as far
    // as available - runs a callback for each.
    internalProto.onData = function (data) {
        var packetContentList, internal = this;

        this.logMsg('Received: ' + data.toString());

        packetContentList = packet.parsePackets(data);

        if (packetContentList === false) {
            return;
        }

        packetContentList.forEach(function (packetContent) {
            var callback = internal.onDataCallbacks[packetContent.type];
            if (callback !== undefined) {
                callback(packetContent);
            }
        });
    };

    internalProto.onDrained = function () {
        var data;

        this.sendIsSafe = true;

        while (this.dataScheduledForSending.length > 0 && this.sendIsSafe) {
            data = this.dataScheduledForSending.shift();
            this.sendIsSafe = this.loggedSend(data);
        }
    };

    internalProto.onSocketError = function (msg) {
        this.onError(util.withFirstCharCapitalized(this.name) + ' loop: ' +
                     msg);

        // From TCPSocket documentation on MDN as of June 2014: If an error
        // occurs before the connection has been opened, the error was
        // connection refused, and the close event will not be triggered. If
        // an error occurs after the connection has been opened, the
        // connection was lost, and the close event will be triggered after
        // the error event.
        if (this.socket.isConnecting || this.socket.isClosed) {
            this.onNoConnection();
        }
    };

    internalProto.openSocket = function () {
        if (!this.socket.isClosed) {
            this.onSocketOpened();
            return;
        }

        if (!this.socket.open()) {
            this.onError('Cannot create socket');
            this.onNoConnection();
        }
    };

    // Works only on an open socket. Returns false iff send could not be
    // scheduled.
    internalProto.scheduleSend = function (data) {
        if (!this.socket.isClosed) {
            return false;
        }

        if (this.sendIsSafe) {
            this.sendIsSafe = this.loggedSend(data);
        } else {
            this.dataScheduledForSending.push(data);
        }

        return true;
    };

    internalProto.prepareSocket = function () {
        var internal = this;

        this.socket.onData = internalProto.onData.bind(this);
        this.socket.onOpen = function () {
            internal.onSocketOpened();
        };
        this.socket.onError = function (event) {
            internal.onSocketError(event);
        };
    };

    create = function (name) {
        var internal = Object.create(internalProto, {
            onDataCallbacks: {value: {}}, // by packet type
            onSocketOpened: {
                value: util.nop,
                writable: true
            },
            sendIsSafe: {
                value: true,
                writable: true
            },
            dataScheduledForSending: {value: []},
            onNoConnection: {
                value: util.nop,
                writable: true
            },
            onError: {
                value: util.nop,
                writable: true
            },
            name: {value: name},
            socket: {value: socketFactory.create()}
        });

        internal.prepareSocket();

        internal.onDataCallbacks[packet.types.initFail] =
            function () {
                internal.onError('Initializing ' + internal.name +
                                 ' loop failed');
            };

        return Object.create(proto, {
            openSocket: {value: function () {
                return internal.openSocket();
            }},
            scheduleSend: {value: function (data) {
                return internal.scheduleSend(data);
            }},
            onSocketOpened: {set: function (f) {
                internal.onSocketOpened = f;
            }},
            onDataCallbacks: {get: function () {
                return internal.onDataCallbacks;
            }},
            onNoConnection: {set: function (f) {
                internal.onNoConnection = f;
            }},
            onError: {set: function (f) {
                internal.onError = f;
            }}
        });
    };

    return Object.create(null, {
        create: {value: create}
    });
});
