#!/usr/bin/env node
'use strict';

const
    _ = require('lodash'),
    argv = require('yargs').argv,
    chalk = require('chalk'),
    fs = require('fs'),
    path = require('path'),
    inquirer = require('inquirer'),
    config = require('./config.json'),   
    elk_config = config.flow.elk_inspector[config.environment],
    flow = require('./flow'),
    lib = require('./lib'),
    lang = require('./lang'), // Contains language for cli 
    shell = require('shelljs'),
    Spinner = require('cli-spinner').Spinner,
    Table = require('cli-table');

// If help menu is invoked show help and exit
if (argv._[0] == 'help' ){
    console.log(chalk.green('Express CLI ELK Inspector Help'));
    console.log(chalk.green('_______________________'));
    console.log(chalk.green('Arguments support not implemented yet. Use interface directly by running "eflk" or "npm run start"'));
    process.exit();
}

console.log(chalk.green('Welcome to Express-CLI\'s EFLK interface!'));
main();

// ------------------------------- Helper functions 
// Main CLI
function main() {
  console.log('______________________________ \n');
  elkInspect() 
}

function eflk_dashboard(cb) {
  let table = new Table({
    head: ['Elasticsearch', 'Logstash','Kibana', 'Filebeat'],
    style: { head: ['green'] } });
    let is_active_array = [];
    is_active_array.push(flow.elk_inspect.elasticsearch_inspector.es_lib.es_daemon.isRunning()? "\u2713 Running":"\u2717 Not Running");

    flow.elk_inspect.logstash_inspector.logstash_helper.isRunning(function(done){
      is_active_array.push((done.state === "red") ? "\u2717 Not Running": (done.state === "green")? "\u2713 Running": "\u25cc Processing Daemon");          
      flow.elk_inspect.kibana_inspector.kibana_helper.isRunning(function(error,results){
      is_active_array.push(!error ? "\u2713 Running":"\u2717 Not Running");
      
      let is_filebeat_running = flow.elk_inspect.filebeat_inspector.filebeat_helper.isRunning(
        config.flow.elk_inspector[config.environment].elk_configs.filebeat, config.flow.elk_inspector[config.environment].elk_executable_path.filebeat
      )
      is_active_array.push(  (!is_filebeat_running || !is_filebeat_running.length) ?  "\u2717 Not Running" : "\u2713 Running")

    let newArr = []
    _.forOwn(elk_config.elk_public_address, function (val){
      newArr.push(val);
    });
    newArr.push(path.basename(config.flow.elk_inspector[config.environment].elk_configs.filebeat))
    table.push(newArr);  
    table.push(is_active_array);    
    console.log(table.toString());
    cb();
    });
  })
}

function elkInspect(){
  eflk_dashboard(function (){
  inquirer.prompt(lang.elk_directions_prompt).then(function (answers) {
    if (answers.direction === "Elasticsearch"){ // For first choice "parse xls"
      console.log(chalk.green('--------- Elasticsearch --------- '));
      flow.elk_inspect.elasticsearch_inspector.init(elkInspect,1);      
    } 
    else if (answers.direction === "Logstash"){
       console.log(chalk.green('--------- Logstash --------- '));
       flow.elk_inspect.logstash_inspector.init(elkInspect); 
    } 
    else if (answers.direction === "Kibana"){
      console.log(chalk.green('--------- Kibana --------- '));
      flow.elk_inspect.kibana_inspector.init(elkInspect,1);                        
    }  else if (answers.direction === "Filebeat"){
      console.log(chalk.green('--------- Filebeat --------- '));
      flow.elk_inspect.filebeat_inspector.init(elkInspect,1);                        
    } else {
      console.log(chalk.green('Thanks for using Express\'s EFLK Interface'));      
      process.exit();    
    }
  });
}); // After construct dashboard has been rendered
}
