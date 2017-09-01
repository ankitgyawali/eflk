"use strict";

const
    utils = require('./utils'),
    // lib_elasticsearch = require('./elasticsearch'),
    logger = require('./logger').logger,
    shell_commands = require('./shell_commands');

module.exports = {
    shell_commands: shell_commands,
    logger: logger,
    // lib_elasticsearch: lib_elasticsearch, // Avoid possible namespace issues
    utils: utils
};
