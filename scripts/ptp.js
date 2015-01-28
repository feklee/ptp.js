/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './data-factory', './main-loop', './event-loop', './connection',
    './set-device-property', './get-device-property',
    './capture',
    './get-object-handles', './get-object-info',
    './get-object', './delete-object',
    './logger', './util', './connection-settings',
    './device-prop-codes', './object-format-codes'
], function (dataFactory, mainLoop, eventLoop, connection,
             setDeviceProperty, getDeviceProperty,
             capture, getObjectHandles, getObjectInfo, getObject, deleteObject,
             logger, util, connectionSettings, devicePropCodes,
             objectFormatCodes) {
    'use strict';

    var onDisconnected = util.nop, onError = util.nop, onConnected = util.nop;

    connection.addEventListener('disconnected', function () {
        onDisconnected.apply(this, arguments);
    });

    connection.addEventListener('error', function () {
        onError.apply(this, arguments);
    });

    connection.addEventListener('connected', function () {
        onConnected.apply(this, arguments);
    });

    return Object.create(null, {
        connect: {value: connection.connect},
        disconnect: {value: connection.disconnect},
        capture: {value: capture},
        onError: {set: function (x) {
            onError = x;
        }},
        onConnected: {set: function (x) {
            onConnected = x;
        }},
        onDisconnected: {set: function (x) {
            onDisconnected = x;
        }},
        onObjectAdded: {set: function (x) {
            eventLoop.objectAddedCallbacks.push(x);
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
            return devicePropCodes;
        }},
        objectFormatCodes: {get: function () {
            return objectFormatCodes;
        }},
        setDeviceProperty: {value: setDeviceProperty},
        getDeviceProperty: {value: getDeviceProperty},
        getObjectHandles: {value: getObjectHandles},
        getObjectInfo: {value: getObjectInfo},
        getObject: {value: getObject},
        deleteObject: {value: deleteObject},
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
