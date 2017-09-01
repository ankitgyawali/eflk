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
    logstash_helper = require('./logstash_helper'),
    request = require('request'),
    shell = require('shelljs');


let init = function(elkInspect) {
    logstash_cli(elkInspect);
};

// exports.isRunning = function (cb) {
//     request({url: elk_config.elk_public_address.logstash , json: true }, function (error, response, body) {
//             cb(error, { state: "green"})
//     });

// }

function logstash_cli(elkInspect) {
    // console.log(logstash_helper);
    inquirer.prompt(lang.logstash_directions_prompt).then(function (answers) {
        if (answers.direction === 'Turn Logstash on with Default Config') { 
            // console.log(elk_config.elk_executable_path.logstash);
            // console.log(elk_config.elk_configs.logstash[0]); // First index is default config
            logstash_helper.start(elk_config.elk_configs.logstash[0], function (){
                logstash_cli(elkInspect);
            });
        }
        else if (answers.direction === 'Turn Logstash on with Custom Config'){
            logstash_cli_configs(logstash_cli, elkInspect); 
        }
        else if (answers.direction === 'Turn Logstash Off'){
            logstash_helper.stop(false, function (){
                logstash_cli(elkInspect);
            });

        } else {
            elkInspect()
        }
    });
}


function logstash_cli_configs(logstash_cli, elkInspect) {
    inquirer.prompt(lang.config_options(elk_config.elk_configs.logstash)).then(function (answers) {
        if (answers.direction !== 'Back') {
            console.log(chalk.blue("Restarting logstash with config: " + answers));
            console.log(chalk.blue("Stopping.."));
            logstash_helper.stop(true, function (){
                console.log(chalk.blue("Starting.."));
                setTimeout(function() {
                        logstash_helper.start(answers.direction, function (){
                            logstash_cli(elkInspect);
                        }); // Start callback ends
                }, 5000);           

            }); // Stop callback ends
        }
        else {
            console.log("Restarting logstash with custom configuration");
            logstash_cli(elkInspect);
        }
    });
}


module.exports = {
    // isrunning: isrunning,
    init: init,
    logstash_helper: logstash_helper
}