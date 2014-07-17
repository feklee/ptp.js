/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var commands, help, run, lengthOfLongestName, spacing, findCommand,
    ptp = require('../..');

commands = [
    {
        name: 'capture',
        description: 'initiate capture',
        value: function () {
            require('commands/capture');
        }
    },
    {
        name: 'set_device_property',
        description: 'sets specified property to specified value',
        value: function () {
            require('commands/set_device_property');
        }
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

run = function (host, commandName) {
    var command = findCommand(commandName);

    if (command === null) {
        console.error('Unknown command:', commandName);
        return;
    }

    require('./connect')({
        ptp: ptp,
        host: host,
        onConnected: command.run
    });
};

module.exports = Object.create(null, {
    help: {value: help},
    run: {value: run}
});
