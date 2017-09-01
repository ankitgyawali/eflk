// Contains functions related to elasticsearch

'use strict';
const
    _ = require('lodash'),
    chalk = require('chalk'),
    Table = require('cli-table'),
    urljoin = require('url-join'),
    request = require('request'),
    config = require('../config.json'),
    elk_config = config.flow.elk_inspector[config.environment],
    es_daemon = require('../flow/elk_inspect/elasticsearch/es_daemon');

let convert_to_table = function(body){
    let index_table = new Table({head: Object.keys(body[0])});
    _.forEach(body, function(index){
        let outer = []
        _.forOwn(index, function(val){
                outer.push(val);
        })
        index_table.push(outer);
        
    });
    return index_table;
}


let cat_es_endpoint = function(endpoint,cb){
        if(es_daemon.isRunning()) {                
        let urlToHit = urljoin(elk_config.elk_public_address.elasticsearch ,"_cat",endpoint);
        console.log("\n GET "+ urlToHit);    
        request({url: urlToHit, json: true }, function (error, response, body) {
        if(error){
            console.log(chalk.red(urlToHit + " Something went wrong with GET: " + url));
            cb();
        } else {
        if(body[0]){
            console.log(convert_to_table(body).toString());
            cb();            
        } else {
            console.log(chalk.red("No "+ endpoint  +" to show!"));
            cb();            
        }
        };
    });
    } else {
        console.log(chalk.red("Please ensure elasticsearch is running before doing ETL related tasks!")); 
        cb();
    }
}

module.exports = {
    convert_to_table: convert_to_table,
    cat_es_endpoint: cat_es_endpoint
}