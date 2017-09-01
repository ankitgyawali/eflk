"use strict";

const
    argv = require('yargs').argv,
    chalk = require('chalk'),
    fs = require('fs'),
    inquirer = require('inquirer'),
    config = require('../../../config.json'),
    Table = require('cli-table'),
    lang = require('../../../lang'), // Contains language for cli 
    // es_lib = require('../../../lib/elasticsearch'),
    es_lib = {
        es_daemon: require('./es_daemon'),
        es_inspect: require('./inspect'),
    },
    request = require('request');


exports.init = function(elkInspect,val) {
    if(val) {    
    es_lib.es_inspect.inspect(function (err,done){
            inspect_cli(elkInspect);
    });        
    }
    else {
    inspect_cli(elkInspect);
    }
};

exports.es_lib = es_lib;

function inspect_cli(elkInspect) {
        inquirer.prompt(lang.es_directions_prompt).then(function (answers) {
        if (answers.direction === 'Turn Elasticsearch On'){ // For first choice "parse xls"
            es_lib.es_daemon.start(function (err,done){
                // console.log("Start elasticsearch callback goes here...");
            });
            inspect_cli(elkInspect);
        }
        else if (answers.direction === 'List all indices'){
            es_lib.es_inspect.inspect_indices(function(done){
            inspect_cli(elkInspect); 
                
            });   
        } 

        else if (answers.direction === 'List all aliases'){
            es_lib.es_inspect.inspect_aliases(function(done){
            inspect_cli(elkInspect);                 
            });   
        } 
        else if (answers.direction === 'Kill Elasticsearch'){
            // var obj = new Spinner('Please wait while killing elasticsearch daemon.. %s')
            // obj.start();
            es_lib.es_daemon.stop(function (err,done){
                // console.log("Stop elasticsearch callback goes here...");
                // obj.stop();
            });
            inspect_cli(elkInspect);
        } 
        else if (answers.direction === 'Rename an Index'){
             console.log(chalk.red('Rename an Index: Not implemented.'));            
             inspect_cli(elkInspect); 
        } else {
            elkInspect()
        }
    });

}