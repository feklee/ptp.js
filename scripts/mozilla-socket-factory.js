// Mozilla web app socket implementation.

/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './util', './connection-settings', './data-factory'
], function (util, connectionSettings, dataFactory) {
    'use strict';

    var create, internalProto = {}, getErrorMsg;

    getErrorMsg = function (event) {
        if (typeof event.data === 'string') {
            return event.data;
        }

        if (event.data !== undefined &&
                typeof event.data.name === 'string') {
            return event.data.name;
        }

        return 'unknown';
    };

    internalProto.getIsConnecting = function () {
        return (this.mozTcpSocket !== undefined &&
                this.mozTcpSocket.readyState.match(/connecting/) !== null);
    };

    internalProto.getIsClosed = function () {
        return (this.mozTcpSocket === undefined ||
                this.mozTcpSocket.readyState.match(/closed/) !== null);
    };

    internalProto.open = function () {
        var internal = this;

        if (navigator.mozTCPSocket === undefined) {
            return false;
        }

        this.mozTcpSocket = navigator.mozTCPSocket.open(
            connectionSettings.host,
            connectionSettings.port,
            {binaryType: 'arraybuffer'}
        );

        this.mozTcpSocket.ondata = function (event) {
            internal.onData(dataFactory.create(event.data));
        };
        this.mozTcpSocket.onopen = function () {
            internal.onOpen();
        };
        this.mozTcpSocket.onerror = function (event) {
            internal.onError(getErrorMsg(event));
        };
        this.mozTcpSocket.onclose = function () {
            internal.onNoConnection();
        };
        this.mozTcpSocket.ondrain = function () {
            internal.onDrained();
        };

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
            mozTcpSocket: {value: undefined, writable: true},
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
