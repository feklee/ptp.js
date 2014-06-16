/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define, Uint8Array */

define([
    './packet', './data-factory', './connection-settings', './util', './logger'
], function (packet, dataFactory, connectionSettings, util, logger) {
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
        var ret = this.socket.send(data.buffer);
        this.logMsg('Sent: ' + data.toString());
        return ret;
    };

    // Parses incoming PTP/IP packets (there may be several fused), and - as far
    // as available - runs a callback for each.
    internalProto.onData = function (event) {
        var data = dataFactory.create(event.data), packetContentList,
            internal = this;

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

    internalProto.onSocketError = function (event) {
        var msg;

        if (typeof event.data === 'string') {
            msg = event.data;
        } else if (event.data !== undefined &&
                   typeof event.data.name === 'string') {
            msg = event.data.name;
        } else {
            msg = 'unknown';
        }
        this.onError(util.withFirstCharCapitalized(this.name) + ' loop: ' +
                     msg);

        // From TCPSocket documentation on MDN as of June 2014: If an error
        // occurs before the connection has been opened, the error was
        // connection refused, and the close event will not be triggered. If
        // an error occurs after the connection has been opened, the
        // connection was lost, and the close event will be triggered after
        // the error event.
        if (this.socket.readyState.match(/connecting|closed/) !== null) {
            this.onNoConnection();
        }
    };

    internalProto.openSocket = function () {
        var internal = this;

        if (this.socket !== undefined &&
                this.socket.readyState === 'open') {
            this.onSocketOpened();
            return;
        }

        this.socket = navigator.mozTCPSocket.open(
            connectionSettings.ip,
            connectionSettings.port,
            {binaryType: 'arraybuffer'}
        );

        this.socket.ondata = function (event) {
            internal.onData(event);
        };
        this.socket.onopen = function () {
            internal.onSocketOpened(internal);
        };
        this.socket.onerror = function (event) {
            internal.onSocketError(event);
        };
        this.socket.onclose = function () {
            internal.onNoConnection();
        };
        this.socket.ondrain = function () {
            internal.onDrained();
        };
    };

    // Works only on an open socket. Returns false iff send could not be
    // scheduled.
    internalProto.scheduleSend = function (data) {
        if (this.socket === undefined || this.socket.readyState !== 'open') {
            return false;
        }

        if (this.sendIsSafe) {
            this.sendIsSafe = this.loggedSend(data);
        } else {
            this.dataScheduledForSending.push(data);
        }

        return true;
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
            name: {value: name}
        });

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
