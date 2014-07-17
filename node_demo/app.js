/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var packageJson = require('../package.json'),
    program = require('commander'),
    commands = require('./commands'),
    host,
    commandName;

program.on('--help', function () {
    console.log('  Host: camera\'s address, e.g. 192.168.1.1');
    console.log('');
    commands.help();
});

program
    .version(packageJson.version)
    .usage('[options] <host> <command>')
    .parse(process.argv);

if (program.args.length !== 2) {
    program.help();
}

host = program.args.shift();
commandName = program.args.shift();

commands.run(host, commandName);
