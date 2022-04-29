// This code is currently unused, but useful later if we want to define tab names via directory structure

// const path = require('path');
// const { sync } = require('glob');

// const tabs = [];
// sync(process.cwd() + '/**/__docs__/**/*.md', {}).forEach(file => {
//   tabs.push(path.basename(path.dirname(file)));
//   console.log(tabs);
// });

// tabs.forEach(tab => {
//     const resolvedTab = tab === '__docs__' ? 'react' : tab;
//     console.log(resolvedTab);
//     sourceMD(path.join(contentBase, `/**/__docs__/${resolvedTab}/*.md`), resolvedTab);
//   });

// module.exports = tabs;
