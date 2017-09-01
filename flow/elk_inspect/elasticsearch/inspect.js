// Contains functions related to inspecting elasticsearch// Contains functions related to elasticsearch

'use strict';
const
    _  = require('lodash'),
    chalk = require('chalk'),
    config = require('../../../config.json'),
    elk_config = config.flow.elk_inspector[config.environment],
    request = require('request'),
    urljoin = require('url-join'),
    es_daemon = require('./es_daemon'),
    utils = require('../../../lib/utils'),
    Table = require('cli-table');

exports.inspect = function(cb) {
    let urlToHit = urljoin(elk_config.elk_public_address.elasticsearch ,"_cluster","health");
    request({url: urlToHit, json: true }, function (error, response, body) {
        console.log(chalk.blue(" \nNow inspecting elasticsearch..."));
        if(error){
            // console.log(error);
            console.log(chalk.red(urlToHit + " did not respond properly.\nConfigure elasticsearch on config.json and turn elasticsearch on to proceed."));
            cb();
        } else {
        console.log(chalk[body.status]("Elasticsearch Status: " + body.status));
        // console.dir(_.pick(body, ['cluster_name','number_of_nodes','active_shards']), {depth: null, colors: true})
        cb();
        };
    });
}

exports.inspect_indices = function(cb){
    utils.cat_es_endpoint("indices",cb);
}

exports.inspect_aliases = function(cb) {
    utils.cat_es_endpoint("aliases",cb);
}