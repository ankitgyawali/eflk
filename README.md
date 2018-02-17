# eflk

`eflk` is an interactive, terminal based tool, that speeds up your day-to-day workflow when working with the stack developed by  elastic.co, which includes: Elasticsearch, Logstash, Filebeat & Kibana.

`eflk` enables you to run the four products from elastic.co as daemon. It also lets you inspect those daemons, restart if anything goes wrong & easily switch between multiple configs. `eflk` does not support `x-pack` or any other authentication layers. So it is recommended to use eflk only on `localhost` or dev environments to improvise your work flow.



## Features

- Easy configuration of the whole stack.
- Provides dashboard to inspect all the deamons.
- Easy logstash configuration switching.
- Lightweight, accessible globally.



## Configuration

Modify `config.json` to configure the module. Instructions to locate config file provided with installation instructions below.

Configuration expects three main parameters for the four stacks:

`elk_executable_path`: Note that the executable path for Elasticsearch, Logstash & Kibana needs to be absolute and must point to the `bin` folder within the main repo/downloaded product provided by `elastic.co`. Since filebeat's executable lies on the root of repo, you can simply point to the root of product.

`elk_public_address`: The Addresses' where the various products will be available at. Default values from `elastic.co` provided on `sample-config.json`.

`elk_configs`: Only `logstash` & `filebeat` are configuration is possible at the moment. `logstash` takes in an array containing absolute path to multiple `*.conf` files (first config on array will be regarded as default) while `filebeat` supports only a string of single absolute path to `*.yml` file.



## Installation

`npm install -g eflk` to install globally. You should now be able to call eflk from anywhere by simply executing `eflk`.

Path's to eflk stack (first time run) can be configured using `eflk configure`, or choosing `configure` option from cli.



## Screenshots

### Default Configuration Screenshot

![Default Configuration Screenshot](docs/images/elfk_home_dashboard.png?raw=true "EFLK Dashboard Home ScreenShot")



### Elasticsearch

![Elasticsearch](docs/images/elasticsearch_indices.png?raw=true "Elasticsearch")



### Filebeat

![Filebeat](docs/images/filebeat.png?raw=true "Filebeat")



### Logstash

![Logstash](docs/images/logstash.png?raw=true "Logstash")



### Kibana

![Kibana](docs/images/kibana.png?raw=true "Kibana")



## About

Module abstracted out from `express-cli`, part of <a href="https://www.express.com" target="_blank">express.com</a>.