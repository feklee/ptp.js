// Socket implementation for privileged Mozilla web apps.

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

    internalProto.onMozTcpSocketError = function (event) {
        this.onError(getErrorMsg(event));

        // From TCPSocket documentation on MDN as of June 2014: If an error
        // occurs before the connection has been opened, the error was
        // connection refused, and the close event will not be triggered. If an
        // error occurs after the connection has been opened, the connection was
        // lost, and the close event will be triggered after the error event.
        if (this.getIsConnecting() || this.getIsClosed()) {
            this.onClose();
        }
    };

    internalProto.open = function () {
        var internal = this;

        if (navigator.mozTCPSocket === undefined ||
                navigator.mozTCPSocket === null) {
            this.onError('navigator.mozTCPSocket not available');
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
        this.mozTcpSocket.onerror = this.onMozTcpSocketError.bind(this);
        this.mozTcpSocket.onclose = function () {
            internal.onClose();
        };
        this.mozTcpSocket.ondrain = function () {
            internal.onDrained();
        };

        return true;
    };

    internalProto.close = function () {
        if (this.mozTcpSocket !== undefined) {
            this.mozTcpSocket.close();
        }
    };

    // Returns false iff it's better to wait for the drain event before sending
    // more data.
    internalProto.send = function (data) {
        if (this.mozTcpSocket === undefined) {
            this.onError('mozTcpSocket not defined for sending');
            return true;
        }

        return this.mozTcpSocket.send(data.buffer);
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
            open: {value: internal.open.bind(internal)},
            close: {value: internal.close.bind(internal)},
            send: {value: internal.send.bind(internal)},
            isClosed: {get: internal.getIsClosed.bind(internal)},
            isConnecting: {get: internal.getIsConnecting.bind(internal)},
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
