'use strict';

const
    _ = require('lodash'),
    config = require('./config.json');
    
let elk_directions_prompt = {
  type: 'list',
  name: 'direction',
  message: 'Please choose one of the options below to proceed:',
  choices: ['Elasticsearch','Logstash','Kibana', 'Filebeat','Exit']
};

let es_directions_prompt = {
  type: 'list',
  name: 'direction',
  message: 'Please choose one of the options below to proceed:',
  choices: ['Turn Elasticsearch On','List all indices', 'List all aliases','Rename an alias' ,'Kill Elasticsearch' ,'Back']
};


let kibana_directions_prompt = {
  type: 'list',
  name: 'direction',
  message: 'Please choose one of the options below to proceed:',
  choices: ['Turn Kibana On','Turn Kibana Off' ,'Back']
};

let logstash_directions_prompt = {
  type: 'list',
  name: 'direction',
  message: 'Please choose one of the options below to proceed:',
  choices: ['Turn Logstash on with Default Config','Turn Logstash on with Custom Config', 'Turn Logstash Off','Back']
};

let filebeat_directions_prompt = {
  type: 'list',
  name: 'direction',
  message: 'Please choose one of the options below to proceed:',
  choices: ['Turn Filebeat On', 'Turn Filebeat Off', 'Is Filebeat Running', 'Back']
};


let config_options  = function(configs){
  let choices_list = _.clone(configs,true); // Clone since user could call options multiple times on same instance
  choices_list.push("Back");
  let choices = {
    type: "list",
    name: "direction",
    message: "Please choose one of the configs below to proceed:", 
    choices: choices_list
  };
  return choices;
}


module.exports = {
  elk_directions_prompt: elk_directions_prompt,
  es_directions_prompt:es_directions_prompt,
  kibana_directions_prompt: kibana_directions_prompt,
  logstash_directions_prompt:logstash_directions_prompt,
  filebeat_directions_prompt:filebeat_directions_prompt,
  config_options:config_options
};
