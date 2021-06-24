'use strict';

let conf;
try {
  conf = require('../package.json');
} catch (e) {
  console.log(e);
}

process.stdout.write(conf.version);
