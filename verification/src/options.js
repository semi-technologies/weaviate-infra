// @flow

const yargs = require('yargs');
const log = require('./log');

type Amounts = {
  thingClasses: number,
  actionClasses: number,
  vertices: number,
  crossReferences: number,
  checks: number,
}

type Authorization = {
  apiKey: string,
  apiToken: string,
}

type ServiceDiscovery = {
  weaviateOrigin: string,
  contextionaryVersion: string,
}

type Modes = {
  debug: boolean,
}

export type GlobalOptions = {
  amounts: Amounts,
  authorization: Authorization,
  serviceDiscovery: ServiceDiscovery,
  modes: Modes,
}

// non-configurable options & defaults
const apiKey = '657a48b9-e000-4d9a-b51d-69a0b621c1b9';
const apiToken = '57ac8392-1ecc-4e17-9350-c9c866ac832b';
const defaults = {
  weaviateOrigin: 'http://localhost:8080',
  contextionaryVersion: 'latest',
};

module.exports = function parse(): GlobalOptions {
  const { argv } = yargs
    .default({
      w: defaults.weaviateOrigin,
      'contextionary-version': defaults.contextionaryVersion,
    })
    .usage('Usage: $0 <command> [options]')
    .command('generate', 'Generate dummy data based on options')
    .demandCommand(1)
    .example('$0 generate -t 10 -r 10 -v 200',
      'generate 10 things in the ontology, add a total of 10 cross-references'
      + ' and create 200 vertices (things and actions)')
    .alias('v', 'vertices')
    .describe('v', 'Number of vertices (Things and Actions) to be generated')
    .alias('t', 'thing-classes')
    .describe('t', 'Number of Thing Classes in the ontology')
    .alias('a', 'action-classes')
    .describe('a', 'Number of Action Classes in the ontology')
    .alias('r', 'cross-references')
    .describe('r', 'Number of Classes that cross-references other classes')
    .alias('w', 'weaviate-origin')
    .describe('w', 'Origin of weaviate (e.g. http://weaviate:8080)')
    .alias('d', 'debug')
    .describe('d', 'Turn on debug mode. Prints results after each step.')
    .alias('c', 'checks')
    .describe('c', 'Number of Round-Robin checks to compare whether sent vertex matches retrieved vertex')
    .describe('contextionary-version', 'Semver version for the contextionary. Should match the version used to start up weaviate with')
    .demandOption(['v', 't', 'a', 'r', 'c'])
    .help('h')
    .alias('h', 'help');

  if (argv.c > argv.v) {
    log.red(`ERROR:\n\tDesired number of checks (${argv.c}) is larger than the number of `
      + `desired vertices (${argv.v})`);
    process.exit(1);
  }

  return {
    amounts: {
      thingClasses: argv.t,
      actionClasses: argv.a,
      vertices: argv.v,
      crossReferences: argv.r,
      checks: argv.c,
    },
    authorization: {
      apiKey,
      apiToken,
    },
    serviceDiscovery: {
      weaviateOrigin: argv.w,
      contextionaryVersion: argv['contextionary-version'],
    },
    modes: {
      debug: !!argv.d,
    },
  };
};
