// File to house all express-cli related shell commands

"use strict";

const
    config = require('../config.json'),
    _ = require('lodash'),
    shell = require('shelljs'),
    path = require('path');

// Elasticsearch related commands
let is_elasticsearch_on = "jps | grep Elasticsearch";

let turn_elasticsearch_on = function(es_path) {    
    return "cd " + es_path + " && ./elasticsearch -p /tmp/express-cli-es-pid -d";
}

let turn_elasticsearch_off = function() {    
    return "kill -9 $(cat /tmp/express-cli-es-pid && echo)";
}

let init_kibana_background_pm2 = function(kibana_path){
    return "pm2 start " +  path.join(kibana_path,"..", "src","cli","index.js") + "  --output /dev/null --name=express-cli-kibana";
}

let write_kibana_process = "echo $! > /tmp/express-cli-kibana-pid";

let check_kibana_process =  "cat /tmp/express-cli-kibana-pid";


let turn_kibana_off_pm2 = function () {
    return  "pm2 delete express-cli-kibana";
};


let turn_logstash_on = function (logstash_bin_path,logstash_config_path) {
    return "cd "+ logstash_bin_path + " && nohup ./logstash -f " + logstash_config_path +" --log.level=fatal -n express-cli-logstash-uid > /dev/null 2>&1&"
}

let turn_logstash_off = function () {
    return "pgrep -f express-cli-logstash-uid | xargs kill"
}

let is_logstash_booting = function () {
    return "pgrep -f express-cli-logstash-uid | wc -l"
}

let run_filebeat_background = function(config, path) {
    return 'cd ' + path + " && nohup ./filebeat -e -c "  + config + ' -d "publish" >/dev/null 2>&1 &';
}

let kill_filebeat_background = function(process_ids){
    let commands =  [];
    _.forEach(process_ids, function(pid){
        commands.push("kill -9 " + pid);
    });

    return commands;
}

let check_filebeat_process = function(config) {
    let config_ps =  config.replace(config[0], "[" + config[0] + "]" )
    return "ps -ef | grep " + config_ps + " | awk '{print $2}'";
}

module.exports = {
    check_kibana_process: check_kibana_process,
    is_elasticsearch_on: is_elasticsearch_on,
    turn_elasticsearch_on: turn_elasticsearch_on,
    turn_elasticsearch_off: turn_elasticsearch_off,
    write_kibana_process: write_kibana_process,
    turn_kibana_off_pm2: turn_kibana_off_pm2,
    init_kibana_background_pm2: init_kibana_background_pm2,
    turn_logstash_on: turn_logstash_on,
    turn_logstash_off: turn_logstash_off,
    is_logstash_booting:is_logstash_booting,
    run_filebeat_background:run_filebeat_background,
    kill_filebeat_background:kill_filebeat_background,
    check_filebeat_process:check_filebeat_process
};