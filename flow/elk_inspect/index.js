"use strict";

const
    elasticsearch_inspector = require('./elasticsearch'),
    logstash_inspector = require('./logstash'),
    filebeat_inspector = require('./filebeat'),
    kibana_inspector = require('./kibana');


module.exports = {
    elasticsearch_inspector:elasticsearch_inspector,
    filebeat_inspector:filebeat_inspector,
    logstash_inspector:logstash_inspector,
    kibana_inspector:kibana_inspector
};
