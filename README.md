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
- Enjoy the ease at which you just created Patternfly-Org docs.

### CLI
Since Patternfly-docs is a wrapper around `theme-patternfly-org`, just with some opinionated pre-baked configurations
all of the original commands are accessible through the Patternfly-docs alias.

To access the `pf-docs` (`theme-patterfly-org`) commands list
   ```shell
     $ pf-docs -h
   ```
   
   ```
     Usage: cli [options] [command]
   
     Options:
       -c, --config <path>                  set config path (default: "./patternfly-docs.config.js")
       -css, --cssconfig <path>             set css import file path (default: "./patternfly-docs.css.js")
       -s, --source <path>                  set source generation file path (default: "./patternfly-docs.source.js")
       -h, --help                           output usage information
     
     Commands:
       generate                             generates source files
       start                                generates source files and runs webpack-dev-server
       build [options] <server|client|all>  generates source files and runs webpack
       serve [options] <folder>             serves a directory on a port
       screenshots [options]                updates screenshots for generated components
   ```
