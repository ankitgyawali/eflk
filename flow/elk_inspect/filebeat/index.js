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
    filebeat_helper = require('./filebeat_helper'),
    request = require('request'),
    shell = require('shelljs');


let init = function(elkInspect) {
    filebeat_cli(elkInspect);
};

// exports.isRunning = function (cb) {
//     request({url: elk_config.elk_public_address.logstash , json: true }, function (error, response, body) {
//             cb(error, { state: "green"})
//     });

// }

function filebeat_cli(elkInspect) {
    // console.log(filebeat_helper);
    inquirer.prompt(lang.filebeat_directions_prompt).then(function (answers) {
        if (answers.direction === 'Turn Filebeat On') { 
            filebeat_helper.start(elk_config.elk_configs.filebeat, elk_config.elk_executable_path.filebeat, function (){
                filebeat_cli(elkInspect);
            });
        }
        else if (answers.direction === 'Turn Filebeat Off'){
            filebeat_helper.stop(elk_config.elk_configs.filebeat, elk_config.elk_executable_path.filebeat, function (){
                filebeat_cli(elkInspect);
            });

        }
        else if (answers.direction === 'Is Filebeat Running'){
            filebeat_helper.isfbRunning(elk_config.elk_configs.filebeat, elk_config.elk_executable_path.filebeat, function (){
                filebeat_cli(elkInspect);
            });
        }  else {
            elkInspect()
        }
    });
}

module.exports = {
    // isrunning: isrunning,
    init: init,
    filebeat_helper: filebeat_helper
}