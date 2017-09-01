"use strict";

const
    argv = require('yargs').argv,
    chalk = require('chalk'),
    fs = require('fs'),
    inquirer = require('inquirer'),
    config = require('../../../config.json'),
    elk_config = config.flow.elk_inspector[config.environment],
    Table = require('cli-table'),
    lang = require('../../../lang'), // Contains language for cli 
    kibana_helper = require('./kibana_helper'), // Contains language for cli 
    request = require('request');

exports.kibana_helper = kibana_helper;

exports.init = function(elkInspect,val) {
    kibana_cli(elkInspect);
};

function kibana_cli(elkInspect) {
    inquirer.prompt(lang.kibana_directions_prompt).then(function (answers) {
        if (answers.direction === 'Turn Kibana On') { 
            // console.log(elk_config.elk_executable_path.kibana);
            kibana_helper.init(function (){
                kibana_cli(elkInspect);
            });
        }
        else if (answers.direction === 'Turn Kibana Off'){
            kibana_helper.stop(function (){
                kibana_cli(elkInspect);
            });
        } else {
            elkInspect()
        }
    });

}
