/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define, ArrayBuffer, Uint8Array */

define(function () {
    'use strict';

    var create, internalProto = {};

    internalProto.add = function (type, listener) {
        var listeners = this.listenersByType[type];

        if (listeners === undefined) {
            listeners = this.listenersByType[type] = [];
        }

        if (listeners.indexOf(listener) === -1) {
            listeners.push(listener);
        }
    };

    internalProto.remove = function (type, listener) {
        var i, listeners = this.listenersByType[type];

        if (listeners === undefined) {
            return;
        }

        i = listeners.indexOf(listener);
        if (i !== -1) {
            listeners.splice(i, 1);
        }
    };

    internalProto.run = function (type, msg) {
        var listeners = this.listenersByType[type];

        if (listeners === undefined) {
            return;
        }

        listeners.forEach(function (listener) {
            listener(msg);
        });
    };

    create = function () {
        var internal = Object.create(internalProto, {
            listenersByType: {value: {}}
        });

        return Object.create(null, {
            add: {value: internal.add.bind(internal)},
            remove: {value: internal.remove.bind(internal)},
            run: {value: internal.run.bind(internal)}
        });
    };

    return Object.create(null, {
        create: {value: create}
    });
});
