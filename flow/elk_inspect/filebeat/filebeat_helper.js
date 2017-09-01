"use strict";

const
    argv = require('yargs').argv,
    chalk = require('chalk'),
    fs = require('fs'),
    _ = require('lodash'),
    inquirer = require('inquirer'),
    config = require('../../../config.json'),
    elk_config = config.flow.elk_inspector[config.environment],
    shell_commands = require('../../../lib/shell_commands'),
    Table = require('cli-table'),
    lang = require('../../../lang'), // Contains language for cli 
    request = require('request'),
    shell = require('shelljs');

let init = function(elkInspect) {
    logstash_cli(elkInspect);
};

let isRunning = function (filebeat_config, filebeat_path, cb) {
    let is_fb_running = shell.exec(shell_commands.check_filebeat_process(filebeat_config),{ silent:true});
    if (is_fb_running.stdout == "") {
        return false;
    } else {
        return _.compact(is_fb_running.stdout.split("\n"));
    }
}

let isfbRunning = function (filebeat_config, filebeat_path , cb)  {
    let isItRunning =  isRunning(filebeat_config, filebeat_path);
    if(!isItRunning || !isItRunning.length) {
        console.log(chalk.red("Filebeat is not running.."));
        cb();
    } else {
        console.log(chalk.green("File beat is running! Associated PID(s): " + isItRunning.join(", ")))
        cb();
    }
}

let start = function (filebeat_config, filebeat_path , cb)  {
    let isItRunning =  isRunning(filebeat_config, filebeat_path);
    if(!isItRunning || !isItRunning.length) {
        let is_fb_running = shell.exec(shell_commands.run_filebeat_background(filebeat_config,filebeat_path), {async:true, silent:true});        
        console.log(chalk.green("Started filebeat Daemon..."));
        cb();
    } else {
        console.log(chalk.yellow("File beat seems to be already running! Associated PID(s): " + isItRunning.join(", ")))
        cb();
    }

}

let stop = function (filebeat_config, filebeat_path, cb)  {
    let isItRunning =  isRunning(filebeat_config, filebeat_path);
    if(!isItRunning || !isItRunning.length) {
        console.log(chalk.yellow("File with specified config: " + filebeat_config + ", is not running, nothing to kill."))
        cb();
    } else {
        let kill_commands = shell_commands.kill_filebeat_background(isItRunning);
        _.forEach(kill_commands, function(command_to_execute){
            let execute = shell.exec(command_to_execute);
        })
        console.log(chalk.yellow("Filebeat process(es) killed!"))
        cb();
    }

}

module.exports = {
    isfbRunning: isfbRunning,
    isRunning: isRunning,
    init: init,
    start: start,
    stop: stop
}