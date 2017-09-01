"use strict";

const
    argv = require('yargs').argv,
    chalk = require('chalk'),
    fs = require('fs'),
    inquirer = require('inquirer'),
    config = require('../../../config.json'),
    elk_config = config.flow.elk_inspector[config.environment],
    Table = require('cli-table'),
    shell_commands = require('../../../lib/shell_commands'),
    lang = require('../../../lang'), // Contains language for cli 
    request = require('request'),
    urljoin = require('url-join'),
    shell = require('shelljs');

let isRunning = function (cb) {
    let kibana_inspect_url = urljoin(elk_config.elk_public_address.kibana, "api", "status");
    request({url: kibana_inspect_url , json: true }, function (error, response, body) {
            cb(error, { state: "green"})
    });
}

let init = function (cb) {
    if(isRunning(function (error,done) {
        if(error) {
// --------------------
            console.log(chalk.green("Please wait while starting kibana process via pm2.."));            
            if (shell.exec(shell_commands.init_kibana_background_pm2(elk_config.elk_executable_path.kibana),{silent:true}).code === 0) {
                console.log(chalk.green("Executed: " + shell_commands.init_kibana_background_pm2(elk_config.elk_executable_path.kibana)));
                console.log(chalk.green("Kibana daemon succesfully started!"));
                cb();
                // TODO: Refactor this
                // if (shell.exec(shell_commands.write_kibana_process).code === 0) {
                // console.log(chalk.green("Kibana pid saved.."));
                // cb();
                // } else {
                //     console.log(chalk.yellow("Kibana process started but could not save pid. There might be error killing kibana daemon."));
                //     cb();
                // }
            } else {
                // Something went wrong gracefully exit
                console.log(chalk.red("Could not execute: "+ shell_commands.init_kibana_background_pm2(elk_config.elk_executable_path.kibana)));  
                console.log("Please check if kibana path is configured properly and try again.")              
                cb();
            }
        }  else {
            console.log(chalk[done.state]("Kibana is alredy running!"));            
            cb();
            // TODO: refactor
            // if (shell.exec(shell_commands.check_kibana_process).code === 0) { // Found
            //     console.log(chalk[done.state]("Kibana is already running!"));
            //     cb();
            // } else { // Not found 
            //     console.log(chalk[done.state]("Kibana is alredy running!"));
            //     console.log(chalk.red("Warning: Seems like kibana was not started via express-cli. This might cause errors. Kill kibana process & restart with express-cli."));
            //     cb();
            // }
        }
    }));
}

let stop = function (cb) {
    if(isRunning(function (error,done) {
        if(error) {
            console.log(chalk.yellow("Kibana is not running! Nothing to close!"));
            cb();
        }  else {  // Stop kibana
            console.log(chalk.blue("Please wait while kibana daemon is being killed.."))
            if (shell.exec(shell_commands.turn_kibana_off_pm2()).code === 0) { 
                console.log(chalk.green("Kibana daemon killed succesfully!")); 
                cb();            
            } else {
                console.log(chalk.red("Something went wrong while stopping kibana. Was it started via express-cli?")); 
                cb();                 
            }
        }
    }));
}

let restart = function () {

}

module.exports =  {
    isRunning: isRunning,
    init:init,
    restart: restart,
    stop: stop
}