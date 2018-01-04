const camelCase = require('lodash.camelcase');
const mapKeys = require('lodash.mapkeys');
const loaderUtils = require("loader-utils");
const SassVariablesExtract = require("./extract.js")
const forEach = require('lodash.foreach')

module.exports = function(content) {
  const self = this;
  const callback = this.async();
  const version = this.version || 1;
  const path = this.resourcePath;

  const options = loaderUtils.getOptions(self);
  const preserveKeys = options && options.preserveKeys ? true : false;

  this.cacheable && this.cacheable();

  try {

    const mapKeyCallback = (value, key) => {
      if (options && options.preserveKeys) {
        return key
      }
      return camelCase(key)
    }

    SassVariablesExtract(this.resourcePath, content).then((result) => {
      const dependencies = result.dependencies;
      const variables = mapKeys(result.variables, mapKeyCallback);
      const defaultExport = JSON.stringify(variables)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');

      // Create Module
      let module = ''
      if (version >= 2) {
        forEach(variables, function (value, name) {
          const constExport = JSON.stringify(value)
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029');
          module += `export var ${camelCase(name)} = ${constExport}\n`;
        })
        module += `export default ${defaultExport}\n`
      } else {
        module = `module.exports = ${defaultExport}\n`
      }

      dependencies.forEach((dependency) => {
        self.addDependency(dependency);
      })

      callback(null, module);
    })
    .catch((error) => {
      callback(error);
    })

  } catch(error) {
    callback(error);
  }
}
