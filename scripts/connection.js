/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './main-loop', './event-loop', './util'
], function (mainLoop, eventLoop, util) {
    'use strict';

    var connect, onConnected = util.nop, onError = util.nop,
        onNoConnection = util.nop, isConnected = false,
        isConnecting = false;

    mainLoop.onNoConnection = eventLoop.onNoConnection = function () {
        onNoConnection();
        isConnected = false;
        isConnecting = false;
    };

    mainLoop.onError = eventLoop.onError = function (msg) {
        onError(msg);
    };

    mainLoop.onInitialized = function () {
        // Event loop is initialized immediately after initialization of main
        // loop, in accordance with section "5.4 Establishment of PTP-IP
        // Connection" in: White Paper of CIPA DC-005-2005
        eventLoop.sessionId = mainLoop.sessionId;
        eventLoop.initialize();
    };

    eventLoop.onInitialized = function () {
        mainLoop.onSessionOpened = function () {
            isConnected = true;
            onConnected();
        };
        mainLoop.openSession();
    };

    // Calling this function again, even during the process of connecting, is
    // safe.
    connect = function () {
        if (!navigator.mozTCPSocket) {
            onError('navigator.mozTCPSocket not available');
            onNoConnection();
            return;
        }

        if (isConnected) {
            return;
        }

        if (!isConnecting) {
            isConnecting = true;
            mainLoop.initialize();
        }
    };

    return Object.create(null, {
        onNoConnection: {set: function (f) {
            onNoConnection = f;
        }},
        onError: {set: function (f) {
            onError = f;
        }},
        onConnected: {set: function (f) {
            onConnected = f;
        }},
        connect: {value: connect}
    });
});
