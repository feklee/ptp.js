// Node.js socket implementation.

/*jslint node: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './util', './connection-settings', './data-factory'
], function (util, connectionSettings, dataFactory) {
    'use strict';

    var create, internalProto = {};

    internalProto.open = function () {
        var internal = this, net = require('net');

        this.isConnecting = true;

        this.client = net.createConnection({
            port: connectionSettings.port,
            host: connectionSettings.host
        }, function () {
            internal.isConnecting = false;
            internal.isClosed = false;
            internal.onOpen();
        });

        this.client.on('data', function (data) {
            internal.onData(dataFactory.create(data));
        });

        this.client.on('error', function (error) {
            internal.isConnecting = false;
            internal.onError(error.message);
        });

        this.client.on('close', function () {
            internal.isConnecting = false;
            internal.isClosed = true;
            internal.onClose();
        });

        this.client.on('drain', function () {
            internal.onDrained();
        });

        return true;
    };

    internalProto.close = function () {
        this.client.end();
    };

    internalProto.send = function (data) {
        if (this.client === undefined) {
            this.onError('client not defined for sending');
            return true;
        }

        return this.client.write(data.buffer);
    };

    create = function () {
        var internal = Object.create(internalProto, {
            client: {value: undefined, writable: true},
            onData: {value: util.nop, writable: true},
            onOpen: {value: util.nop, writable: true},
            onError: {value: util.nop, writable: true},
            onClose: {value: util.nop, writable: true},
            onDrain: {value: util.nop, writable: true},
            isConnecting: {value: false, writable: true},
            isClosed: {value: true, writable: true}
        });

        return Object.create(null, {
            open: {value: internal.open.bind(internal)},
            close: {value: internal.close.bind(internal)},

            // Returns false iff it's better to wait for the drain event before
            // sending more data.
            send: {value: internal.send.bind(internal)},

            isClosed: {get: function () {
                return internal.isClosed;
            }},
            isConnecting: {get: function () {
                return internal.isConnecting;
            }},
            onData: {set: function (f) {
                internal.onData = f;
            }},
            onOpen: {set: function (f) {
                internal.onOpen = f;
            }},
            onError: {set: function (f) {
                internal.onError = f;
            }},
            onClose: {set: function (f) { // Called also on socket error
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
