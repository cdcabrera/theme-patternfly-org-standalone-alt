const path = require("path");
const os = require("os");
const fs = require("fs-extra");
const { Cluster } = require("puppeteer-cluster");
const sharp = require("sharp");
const { slugger } = require("theme-patternfly-org/helpers/slugger");

/**
 * Pull context set routes.
 *
 * @type {object}
 */
const clientRoutes = require(require("path").join(
  process.cwd(),
  "patternfly-docs.routes"
));

/**
 * Pull context generated routes.
 *
 * @type {object}
 */
const generatedRoutes = require(require("path").join(
  process.cwd(),
  "src/generated"
));

/**
 * Set image processing cache.
 */
sharp.cache(false);

/**
 * Callback for parsing and writing images. See "puppeteer-cluster" for params.
 *
 * @param {object} options
 * @param {*} options.page
 * @param {object} options.data
 * @param {string} options.data.url
 * @param {string} options.data.urlPrefix
 * @return {Promise<void>}
 */
const writeScreenshot = async ({
  page,
  data: { url, urlPrefix, outputDir },
} = {}) => {
  const outfile = path.join(
    _PF_DOCS_CONTEXT_PWD,
    outputDir,
    `${url.replace(`${urlPrefix}/`, "")}.png`
  );

  // Default viewport is 800x600
  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  await page.goto(url);
  await page.waitForSelector(".pf-u-h-100");

  // Wait extra 300ms
  await new Promise((resolve) => {
    setTimeout(resolve, 300);
  });

  fs.ensureDirSync(path.dirname(outfile));
  await page.screenshot({ path: outfile });
  console.log(path.relative(process.cwd(), outfile));

  // Resize since max-width allowed for thumbnails in CSS is 800px
  const buffer = await sharp(outfile).resize(800, 450).toBuffer();

  // Overwrite old file
  await sharp(buffer).toFile(outfile);
};

/**
 * Return formatted route objects.
 *
 * @param {object} routes
 * @return {*}
 */
const generateFullScreenRoutes = (routes) =>
  Object.entries(routes)
    .filter(
      ([, { examples, fullscreenExamples }]) => examples || fullscreenExamples
    )
    .reduce((acc, val) => {
      const [path, { Component, examples = [], fullscreenExamples = [] }] = val;
      examples.concat(fullscreenExamples).forEach((title) => {
        const slug = `${path}/${slugger(title)}`;
        acc[slug] = {
          title,
          Component,
          isFullscreen: true,
          isFullscreenOnly: fullscreenExamples.includes(title),
        };
      });
      return acc;
    }, {});

/**
 * Setup and write screenshots.
 *
 * @param {object} options
 * @param {object} options.outputDir
 * @param {object} options.routes
 * @param {string} options.urlPrefix
 * @returns {Promise<void>}
 */
const writeScreenshots = async ({
  urlPrefix,
  outputDir,
  routes = {
    ...clientRoutes,
    ...generatedRoutes,
  },
} = {}) => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: os.cpus().length,
  });

  // Initialize a writing screenshots
  await cluster.task(writeScreenshot);

  // Get updated generated routes
  const updatedRoutes = generateFullScreenRoutes(routes);

  // Add some pages to queue
  Object.entries(updatedRoutes).forEach(([url]) =>
    cluster.queue({
      url: `${urlPrefix}${url}`,
      urlPrefix,
      outputDir
    })
  );

  // Shutdown after everything is done
  await cluster.idle();
  await cluster.close();
};

module.exports = {
  writeScreenshot,
  writeScreenshots,
};
