#!/usr/bin/env node

import { Command } from 'commander';
import { installCommand } from './commands/install.js';
import { showCommand } from './commands/show.js';
import { paramsCommand } from './commands/params.js';

const program = new Command();

program
  .name('chappa')
  .description('CLI for chappa operations')
  .version('1.0.0');

program
  .addCommand(installCommand)
  .addCommand(showCommand)
  .addCommand(paramsCommand);

program.parse(process.argv);
