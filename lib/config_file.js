const resolve = require('path').resolve;
const readFileSync = require('fs').readFileSync;

const configFiles = [ '.kibana-plugin-helpers.json', '.kibana-plugin-helpers.dev.json' ];
const configCache = {};
const KIBANA_ROOT_OVERRIDE = process.env.KIBANA_ROOT ? resolve(process.env.KIBANA_ROOT) : null;

module.exports = function (root) {
  if (!root) root = process.cwd();

  if (configCache[root]) {
    return configCache[root];
  }

  // config files to read from, in the order they are merged together
  let config = configCache[root] = {};

  configFiles.forEach(function (configFile) {
    try {
      const content = JSON.parse(readFileSync(resolve(root, configFile)));
      config = Object.assign(config, content);
    } catch (e) {
      // noop
    }
  });

  // if the kibanaRoot is set, use resolve to ensure correct resolution
  if (config.kibanaRoot) config.kibanaRoot = resolve(root, config.kibanaRoot);
  if (KIBANA_ROOT_OVERRIDE) config.kibanaRoot = KIBANA_ROOT_OVERRIDE;

  return config;
};
