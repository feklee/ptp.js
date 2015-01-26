/*jslint node: true, maxerr: 50, maxlen: 80 */

'use strict';

var host, commandName, parameters,
    packageJson = require('../package.json'),
    program = require('commander'),
    commands = require('./commands'),
    exit = require('exit'),
    customHelp;

customHelp = function () {
    console.log('  Host: camera\'s address, e.g. 192.168.1.1');
    console.log('');
    commands.help();
};

program
    .option('-v, --verbose', 'print verbose messages')
    .on('--help', customHelp);

program
    .version(packageJson.version)
    .usage('[options] <command> [parameters]')
    .parse(process.argv);

commandName = program.args.shift();
parameters = program.args;

if (!commands.syntaxIsCorrect({commandName: commandName,
                               parameters: parameters})) {
    program.help();
}

console.log('');
commands.run({
    verboseOutputIsRequested: program.verbose,
    commandName: commandName,
    parameters: program.args
});
