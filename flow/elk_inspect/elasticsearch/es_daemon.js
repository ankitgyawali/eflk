// Contains function related to manipulating elasticsearch daemon

'use strict';
const
    chalk = require('chalk'),
    config = require('../../../config.json'),
    elk_config = config.flow.elk_inspector[config.environment],
    ora = require('ora'),
    shell_commands = require('../../../lib/shell_commands'),
    shell = require('shelljs'),
    Spinner = require('cli-spinner').Spinner;


let isRunning = function () {
    return (shell.exec(shell_commands.is_elasticsearch_on,{silent:true}).code === 0);
}


let start = function(cb) {
    if (isRunning()) { // If true es is running
            console.log(chalk.green("Elasticsearch is already running!")); 
            cb();
    }
    else  { // Command errored out, init elasticsearch daemon
            console.log(chalk.blue("Please wait while elasticsearch daemon is being started.."))
            if (shell.exec(shell_commands.turn_elasticsearch_on(elk_config.elk_executable_path.elasticsearch)).code === 0) { 
                console.log(chalk.green("Elasticsearch daemon started succesfully!")); 
                cb();            
            } else {
                // spin.stop();            
                console.log(chalk.red("Something went wrong while running elasticsearch. \nPlease check if elasticsearch executable path is properly set on config.json.")); 
                cb();                 
            }

    };

}

let stop = function(cb) {
    if (!isRunning()) { // If command runs fine elasticsearch is running
            console.log(chalk.green("Elasticsearch daemon was not decteced. Nothing to close.")); 
            cb();
    }
    else  { // Command errored out, init elasticsearch daemon
            console.log(chalk.blue("Please wait while elasticsearch daemon is being killed.."))
            if (shell.exec(shell_commands.turn_elasticsearch_off()).code === 0) { 
                console.log(chalk.green("Elasticsearch daemon killed succesfully!")); 
                cb();            
            } else {
                spinner.stop();            
                console.log(chalk.red("Something went wrong while stopping elasticsearch.")); 
                cb();                 
            }

    };

}

module.exports = {
    start: start,
    stop: stop,
    isRunning:isRunning
}