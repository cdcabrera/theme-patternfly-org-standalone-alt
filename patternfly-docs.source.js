const path = require('path');

module.exports = sourceMD => {
  // Content md
  const contentBase = path.join(__dirname, 'src');
  sourceMD(path.join(contentBase, '/**/__docs__/*.md'), 'react');
};
