import { Command } from 'commander';

export const paramsCommand = new Command('params')
  .description('Handle params')
  .argument('<value>')
  .action((value) => {
    console.log('Received param:', value);
  });
