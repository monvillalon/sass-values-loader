const loaderUtils = require("loader-utils");
const SassVariablesExtract = require("./extract.js")

module.exports = function(content) {
  const self = this;
  const options = loaderUtils.getOptions(self);
  const callback = this.async();
  const version = this.version || 1;
  const path = this.resourcePath;

  this.cacheable && this.cacheable();

  SassVariablesExtract(this.resourcePath, content).then((result) => {
    const dependencies = result.dependencies;
    const variables = result.variables;
    const value = JSON.stringify(variables)
                     .replace(/\u2028/g, '\\u2028')
                     .replace(/\u2029/g, '\\u2029');
    const module = version >= 2
         ? `export default ${value};`
         : `module.exports = ${valuexae};`;

    dependencies.forEach((dependency) => {
      self.addDependency(dependency);
    })

    callback(null, module);
  })
  .catch((error) => {
    callback(error);
  })
}
