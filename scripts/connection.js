/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './main-loop', './event-loop', './event-listeners-factory'
], function (mainLoop, eventLoop, eventListenersFactory) {
    'use strict';

    var connect, disconnect, isConnected = false, isConnecting = false,
        eventListeners = eventListenersFactory.create();

    mainLoop.onDisconnected = eventLoop.onDisconnected = function () {
        if (isConnected) {
            eventListeners.run('disconnected');
        }
        isConnected = false;
        isConnecting = false;
    };

    mainLoop.onError = eventLoop.onError = function (msg) {
        eventListeners.run('error', msg);
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
            eventListeners.run('connected');
        };
        mainLoop.openSession();
    };

    // Calling this function again, even during the process of connecting, is
    // safe.
    connect = function () {
        if (isConnected) {
            return;
        }

        if (!isConnecting) {
            isConnecting = true;
            mainLoop.initialize();
        }
    };

    disconnect = function () {
        mainLoop.stop();
        eventLoop.stop();
    };

    return Object.create(null, {
        addEventListener: {value: eventListeners.add},
        removeEventListener: {value: eventListeners.remove},
        isConnected: {get: function () {
            return isConnected;
        }},
        connect: {value: connect},
        disconnect: {value: disconnect}
    });
});
