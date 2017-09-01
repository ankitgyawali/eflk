"use strict";

const
    winston = require('winston'),
    config = require('../config.json');

const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(
        { 
            colorize: true, 
            prettyPrint: true
        }),
      new (winston.transports.File)(
        { 
            filename: config.logs.cli_logs,
            logstash: true,
            maxFiles: config.logs.maximum_rotating_log_files, // 10 files
            maxsize: config.logs.maximum_rotating_log_filesize // 200 mb
        })
    ]
  });
  
module.exports = {
    logger:logger
};