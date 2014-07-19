/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './data-factory', './main-loop', './connection', './command',
    './set-device-property', './get-device-property',
    './capture', './logger', './util', './socket-factory',
    './connection-settings'
], function (dataFactory, mainLoop, connection,
             command, setDeviceProperty, getDeviceProperty,
             capture, logger, util, socketFactory, connectionSettings) {
    'use strict';

    var onNoConnection = util.nop, onError = util.nop, onConnected = util.nop;

    connection.addEventListener('noConnection', function () {
        onNoConnection();
    });

    connection.addEventListener('error', function () {
        onError();
    });

    connection.addEventListener('connected', function () {
        onConnected();
    });

    return Object.create(null, {
        connect: {value: connection.connect},
        capture: {value: capture},
        onNoConnection: {set: function (x) {
            onNoConnection = x;
        }},
        onError: {set: function (x) {
            onError = x;
        }},
        onConnected: {set: function (x) {
            onConnected = x;
        }},
        host: {set: function (x) {
            connectionSettings.host = x;
        }},
        port: {set: function (x) {
            connectionSettings.port = x;
        }},
        clientGuid: {set: function (x) {
            mainLoop.clientGuid = x;
        }},
        clientName: {set: function (x) {
            mainLoop.clientName = x;
        }},
        devicePropCodes: {get: function () {
            return command.devicePropCodes;
        }},
        setDeviceProperty: {value: setDeviceProperty},
        getDeviceProperty: {value: getDeviceProperty},
        dataFactory: {get: function () {
            return dataFactory;
        }},
        loggerOutputIsEnabled: {
            set: function (x) {
                logger.outputIsEnabled = x;
            },
            get: function () {
                return logger.outputIsEnabled;
            }
        },
        dateTimeString: {value: util.dateTimeString}
    });
});
