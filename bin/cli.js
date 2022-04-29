#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { program } = require('commander');

/**
 * Set consumer project path.
 *
 * @type {string}
 * @private
 */
global._PF_DOCS_CONTEXT_PWD = process.cwd();

/**
 * Set pf-docs node_module path.
 *
 * @type {string}
 * @private
 */
global._PF_DOCS_PACKAGE_PWD = path.join(__dirname, '..');

/**
 * Declare an empty global for reference, and setting a routes configuration in the future.
 *
 * @type {string}
 * @private
 */
global._PF_DOCS_ROUTES_OPT = undefined;

/**
 * Declare an empty global for reference, and setting a port configuration in the future.
 *
 * @type {number}
 * @private
 */
global._PF_DOCS_PORT_OPT = 8003;

/**
 * Apply context as the node_module path.
 * There are multiple hard coded facets to theme-patternfly-org this gets around that and uses pf-docs as the base repo.
 */
process.chdir(_PF_DOCS_PACKAGE_PWD);

/**
 * Update the default configuration locations, and NOW allow "routes" and "port" settings.
 */
program
  .option('-c, --config <path>', 'set config path', './patternfly-docs.config.js')
  .option('-d, --cssconfig <path>', 'set css import file path', './patternfly-docs.css.js')
  .option('-s, --source <path>', 'set css import file path', './patternfly-docs.source.js')
  .option('-r, --routes <path>', 'set routes file path', './patternfly-docs.routes.js');

/**
 * Update theme-patternfly-org's use of start.
 */
program
  .command('start')
  .option('-p, --port <port>', 'set webpack port', _PF_DOCS_PORT_OPT)
  .description('generates source files, and runs webpack-dev-server')
  .action(localOptions => {
    const { start } = require('theme-patternfly-org/scripts/cli/start');
    const options = { ...program.opts(), ...localOptions };

    if (options?.routes && fs.existsSync(options?.routes)) {
      global._PF_DOCS_ROUTES_OPT = require(path.join(process.cwd(), options?.routes));
    }

    if (options?.port) {
      let updatedPort = Number.parseInt(options?.port, 10);

      if (typeof updatedPort === 'number' && !Number.isNaN(updatedPort)) {
        global._PF_DOCS_PORT_OPT = updatedPort;
      }
    }

    /**
     * Allow theme-patternfly-org to access what it was before with "parent". We think this has to do with the
     * older version of commander being used.
     *
     * @type {{[p: string]: any, parent: {[p: string]: any}}}
     */
    const updatedOptions = {
      ...options,
      parent: {
        ...options
      }
    };

    start(updatedOptions);
  });

program
  .command('generate')
  .option('--outputDir <path>', 'output directory for generated files', './pfdocs/generated')
  .description('generates source files')
  .action(localOptions => {
    const options = { ...program.opts() };
    const { generate } = require('theme-patternfly-org/scripts/cli/generate');

    const updatedOptions = {
      ...options,
      parent: {
        ...options
      }
    };

    /**
     * FixMe: theme-pf-org package flips context multiple times during webpack build
     * To avoid a rewrite it's easier to simply copy everything out.
     */
    const generatedPackagePath = path.join(_PF_DOCS_PACKAGE_PWD, './src/generated');
    const generatedContextPath = path.join(_PF_DOCS_CONTEXT_PWD, localOptions.outputDir);

    execSync(`rm -rf ${generatedPackagePath}; rm -rf ${generatedContextPath}`);

    generate(updatedOptions);

    console.info(`Moving files to ${localOptions.outputDir}`);
    execSync(`cp -R ${generatedPackagePath} ${generatedContextPath}`);
  });

program
  .command('build [all]')
  .option('-a, --analyze', 'use webpack-bundle-analyzer', false)
  .option('--serverDir <path>', 'output directory for webpack server files', './.cache/pfdocs-ssr-build')
  .option('--clientDir <path>', 'output directory for webpack client files', './pfdocs/public')
  .description('generates source files and runs webpack')
  .action(async (cmd, localOptions) => {
    const options = { ...program.opts() };
    const { build } = require('theme-patternfly-org/scripts/cli/build');

    const updatedOptions = {
      ...localOptions,
      parent: {
        ...options
      }
    };

    /**
     * FixMe: theme-pf-org package flips context multiple times during webpack build
     * To avoid a rewrite it's easier to simply copy everything out.
     */
    const clientPackagePath = path.join(_PF_DOCS_PACKAGE_PWD, './public');
    const clientContextPath = path.join(_PF_DOCS_CONTEXT_PWD, localOptions.clientDir);
    const serverPackagePath = path.join(_PF_DOCS_PACKAGE_PWD, './.cache/ssr-build');
    const serverContextPath = path.join(_PF_DOCS_CONTEXT_PWD, localOptions.serverDir);

    execSync(`rm -rf ${clientPackagePath}; rm -rf ${clientContextPath}`);
    execSync(`rm -rf ${serverPackagePath}; rm -rf ${serverContextPath}`);

    /**
     * FixMe: building just the "server", or just the client appears busted in current tool
     * To avoid a rewrite we force pass the command 'all' for now
     */
    await build('all', updatedOptions);

    console.info(`Moving files to ${localOptions.clientDir}`);
    execSync(`cp -R ${clientPackagePath} ${clientContextPath}`);
    execSync(`cp -R ${serverPackagePath} ${serverContextPath}`);
  });

program
  .command('serve <path>')
  .option('-p, --port <port>', 'port to serve on', _PF_DOCS_PORT_OPT)
  .description(`serves a directory on a port, or default port ${_PF_DOCS_PORT_OPT}`)
  .action((cmd, localOptions) => {
    // Switch context for local serving
    process.chdir(_PF_DOCS_CONTEXT_PWD);

    const { serve } = require('theme-patternfly-org/scripts/cli/serve');
    serve(cmd, localOptions);
  });

program
  .command('screenshots')
  .option('-u, --urlPrefix <prefix>', 'where fullscreen pages are hosted', `http://localhost:${_PF_DOCS_PORT_OPT}`)
  .option('--outputDir <prefix>', 'where screenshots are output', `./pfdocs/screenshots`)
  .description('updates screenshots for generated components')
  .action(localOptions => {
    const { writeScreenshots } = require('../scripts/writeScreenshots');
    writeScreenshots(localOptions);
  });

program.parse();
