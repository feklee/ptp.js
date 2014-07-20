// Node.js socket implementation.

/*jslint node: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './util', './connection-settings', './data-factory'
], function (util, connectionSettings, dataFactory) {
    'use strict';

    var create, internalProto = {};

    internalProto.getIsConnecting = function () {
        return (this.client !== undefined &&
                this.client.readyState.match(/connecting/) !== null);
    };

    internalProto.getIsClosed = function () {
        return (this.mozTcpSocket === undefined ||
                this.mozTcpSocket.readyState.match(/closed/) !== null);
    };

    internalProto.open = function () {
        var internal = this, net = require('net');

        this.client = net.createConnection({
            port: connectionSettings.port,
            host: connectionSettings.host
        }, function () {
            internal.onOpen();
        });

        this.client.on('data', function (data) {
            internal.onData(dataFactory.create(data));
        });

        this.client.on('error', function (error) {
            internal.onError(error.message);
        });

        this.client.on('close', function () {
            internal.onClose();
        });

        this.client.on('drain', function () {
            internal.onDrained();
        });

        return true;
    };

    // Returns false iff it's better to wait for the drain event before sending
    // more data.
    internalProto.send = function (data) {
        if (this.mozTcpSocket !== undefined) {
            return this.mozTcpSocket.send(data.buffer);
        }
        return true;
    };

    create = function () {
        var internal = Object.create(internalProto, {
                client: {value: undefined, writable: true},
                onData: {value: util.nop, writable: true},
                onOpen: {value: util.nop, writable: true},
                onError: {value: util.nop, writable: true},
                onClose: {value: util.nop, writable: true},
                onDrain: {value: util.nop, writable: true}
            });

        return Object.create(null, {
            open: {value: function () {
                return internal.open();
            }},
            send: {value: function (data) {
                return internal.send(data);
            }},
            isClosed: {get: internal.getIsClosed},
            isConnecting: {get: internal.getIsConnecting},
            onData: {set: function (f) {
                internal.onData = f;
            }},
            onOpen: {set: function (f) {
                internal.onOpen = f;
            }},
            onError: {set: function (f) {
                internal.onError = f;
            }},
            onClose: {set: function (f) {
                internal.onClose = f;
            }},
            onDrain: {set: function (f) {
                internal.onDrain = f;
            }}
        });
    };

    return Object.create(null, {
        create: {value: create}
    });
});
