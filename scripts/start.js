const _require = id => require(require.resolve(id, { paths: [require.main.path] }));

const WebpackDevServer = _require('webpack-dev-server');
const webpack = _require('webpack');
const clientConfig = require('./webpack.client.config');
const { generate } = require('theme-patternfly-org/scripts/cli/generate');
const { getConfig } = require('theme-patternfly-org/scripts/cli/helpers');
const { watchMD } = require('theme-patternfly-org/scripts/md/parseMD');

function startWebpackDevServer(webpackConfig) {
  webpackConfig.devServer.filename = webpackConfig.output.filename;
  webpackConfig.devServer.publicPath = webpackConfig.output.publicPath;
  const { port } = webpackConfig.devServer;
  const compiler = webpack(webpackConfig);
  const server = new WebpackDevServer(compiler, webpackConfig.devServer);

  server.listen(port, 'localhost', err => {
    if (err) {
      console.log(err);
    }
  });
}

async function start(options) {
  generate(options, true);
  const webpackClientConfig = await clientConfig(null, { mode: 'development', ...getConfig(options) });
  console.log('start webpack-dev-server');
  watchMD();
  startWebpackDevServer(webpackClientConfig);
}

module.exports = {
  start
};
