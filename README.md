## Patternfly-docs (pf-docs)

A convenience wrapper and alias for running Patternfly-Org styled documentation in a browser quickly. 

Use `pf-docs` to proof and run documentation markdown files, and examples.

## Usage

### Install

NPM install to your repository. Add `pf-docs` to `package.json`.

  ```shell
    $ npm i pf-docs
  ```
or Yarn

  ```shell
    $ yarn add pf-docs
  ```

### Getting started quickly
To get started writing Patternfly-Org styled documentation
- Create documentation directories using `__docs__` as the directory names. Create as many as you like.
- Add Patternfly-org styled markdown files to your `__docs__` directories. [Markdown style guide can be found here](https://www.patternfly.org/v4/ux-writing/about)
- Create a convenience NPM script to run your docs from your repository in `package.json`
   ```
    "scripts": {
      "docs": "pf-docs start; open http://localhost:8003/"
    }
   ```
- Make sure you've `.gitignore`'d these directories
   - `.cache` - a generic catch-all location, which is probably already in your `.gitignore`, used to cache server build output
     - `./.cache/pfdocs-ssr-build`
   - `pfdocs` - is a catch-all location for cli outputs, ignoring it lets you use the tool without having to check things in.
     - `./pfdocs/generated` - output directory for the generated command
     - `./pfdocs/public` - output directory for the build command client webpack output
     - `./pfdocs/screenshots` - output directory for the screenshots command

- Enjoy the ease at which you just created Patternfly-Org docs.

#### Additional quick NPM scripts
Feel free to use these scripts as a base for all of your `pf-docs` NPM scripts. Additional combinations can be used
since defaults carry between commands, such as `port` and directory output locations. If we're missing something, open an issue or a PR!

```
    "scripts": {
      "docs:start": "pf-docs start; open http://localhost:8003/",
      "docs:screenshots": "pf-docs screenshots",
      "docs:build": "pf-docs build",
      "docs:generate": "pf-docs generate",
      "docs:serve": "pf-docs serve ./src"
    }
```

### CLI
Since Patternfly-docs is a wrapper around `theme-patternfly-org`, just with some opinionated pre-baked configurations
all of the original commands are accessible through the Patternfly-docs alias.

To access the `pf-docs` (`theme-patterfly-org`) commands list
   ```shell
     $ pf-docs -h
   ```
   
   ```
      Usage: pf-docs [options] [command]
      
      Options:
        -c, --config <path>     set config path (default: "./patternfly-docs.config.js")
        -d, --cssconfig <path>  set css import file path (default: "./patternfly-docs.css.js")
        -s, --source <path>     set css import file path (default: "./patternfly-docs.source.js")
        -r, --routes <path>     set routes file path (default: "./patternfly-docs.routes.js")
        -h, --help              display help for command
      
      Commands:
        start [options]         generates source files and runs webpack-dev-server
        generate [options]      generates source files
        build [options] [all]   generates source files and runs webpack
        serve [options] <path>  serves a directory on a port
        screenshots [options]   updates screenshots for generated components
        help [command]          display help for command
   ```
