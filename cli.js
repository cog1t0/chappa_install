#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .option('-p, --param <value>', 'Add params')
  .parse(process.argv);

const options = program.opts();
console.log('receive param: %s', options.param);
