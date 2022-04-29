const path = require('path');

module.exports = sourceMD => {
  const contentBase = path.join(process.cwd(), 'src');

  sourceMD(path.join(contentBase, '/**/__docs__/**/*.md'), 'react');
};
