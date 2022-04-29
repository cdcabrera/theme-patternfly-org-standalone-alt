const path = require('path');

module.exports = sourceMD => {
  const contentBase = path.join(_PF_DOCS_CONTEXT_PWD, 'src');
  sourceMD(path.join(contentBase, '/**/__docs__/*.md'), 'react');
};
