"use strict";

const
    argv = require('yargs').argv,
    chalk = require('chalk'),
    fs = require('fs'),
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

let isRunning = function (cb) {

    request({url: elk_config.elk_public_address.logstash , json: true }, function (error, response, body) {
        let status = shell.exec(shell_commands.is_logstash_booting(),{silent: true}).stdout.includes("0");
        if (status){ // No process running
            cb({ state: "red"});    
        } else { // Process running
            if (error) { // But cannot access api
                cb({ state: "yellow"});    
            } else { 
                cb({ state: "green"});    
            }
        }


    });

}

let start = function (logstash_config, cb)  {
    if(isRunning(function (done) {
        if(done.state === "red") {
            console.log(chalk.blue("Executing async command: " + shell_commands.turn_logstash_on(elk_config.elk_executable_path.logstash,logstash_config)));                       
            console.log(chalk.green("Please give logstash some time while it starts.."));
           
            if (shell.exec(shell_commands.turn_logstash_on(elk_config.elk_executable_path.logstash,logstash_config),{silent:true, async: true}).code === 0) {
                console.log(chalk.green("Logstash daemon succesfully started!"));
                cb();
            } else {
                // Something went wrong gracefully exit
                // console.log(chalk.red("Could not execute logstash init script. Please check if Logstash path is configured properly and try again."));
                cb();
            }
        }  else {
            console.log(chalk[done.state]("Logstash is already running!"));            
            cb();
        }


    }));

}


let stop = function (silent, cb)  {
    if(isRunning(function (done) {
        if(done.state === "red") {
            if(!silent){ 
            console.log(chalk.yellow("Logstash is not running! Nothing to close!"));
            }
            cb();
        }  else {  // Stop Logstash
            console.log(chalk.blue("Please wait while logstash daemon is being killed.."))
            console.log(chalk.blue("Executing: "+ shell_commands.turn_logstash_off()));
            if (shell.exec(shell_commands.turn_logstash_off(),{silent:true}).code === 0) { 
                console.log(chalk.green("Logstash daemon killed succesfully!")); 
                cb();            
            } else {
                console.log(chalk.red("Something went wrong while stopping Logstash. Was it started via express-cli?")); 
                cb();                 
            }
        }
    }));
}

module.exports = {
    isRunning: isRunning,
    init: init,
    start: start,
    stop: stop
}