/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var commands, help, run, lengthOfLongestName, spacing, findCommand,
    ptp = require('../..'),
    capture = require('./capture'),
    getDeviceProperty = require('./get_device_property');

commands = [
    {
        name: 'capture',
        description: 'initiate capture',
        run: capture
    },
    {
        name: 'get_device_property',
        parameters: ['code'],
        description: 'get value of specified property',
        run: getDeviceProperty
    },
    {
        name: 'list_device_properties',
        description: 'list standard device property codes',
        run: getDeviceProperty
    }
];

lengthOfLongestName = function () {
    var length = 0;
    commands.forEach(function (command) {
        length = Math.max(length, command.name.length);
    });
    return length;
};

spacing = function (length) {
    return new Array(length + 1).join(' ');
};

help = function () {
    var l = lengthOfLongestName();
    console.log('  Commands:');
    console.log('');
    commands.forEach(function (command) {
        console.log('    ' + command.name +
                    spacing(l - command.name.length + 2) +
                    command.description);
    });
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    app 192.168.1.1 capture');
    console.log('    app 192.168.1.1 list_device_properties');
    console.log('    app 192.168.1.1 get_device_property 0x5001');
    console.log('    app 192.168.1.1 set_device_property 1000');
};

findCommand = function (commandName) {
    var i, command;
    for (i = 0; i < commands.length; i += 1) {
        command = commands[i];
        if (command.name === commandName) {
            return command;
        }
    }
    return null;
};

run = function (options) {
    var command = findCommand(options.commandName);

    if (command === null) {
        console.error('Unknown command:', options.commandName);
        return;
    }

    require('./connect')({
        ptp: ptp,
        host: options.host,
        onConnected: command.run,
        verboseOutputIsRequested: options.verboseOutputIsRequested
    });
};

module.exports = Object.create(null, {
    help: {value: help},
    run: {value: run}
});
