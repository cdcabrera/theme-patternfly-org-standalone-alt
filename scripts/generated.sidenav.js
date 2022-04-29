const generatedRoutes = require(require('path').join(process.cwd(), 'src/generated'));
const sideNav = [];

Object.entries(generatedRoutes).forEach(([key]) => {
  const text = key.split('/')[1];
  sideNav.push({
    text,
    href: key
  });
});

module.exports = sideNav;
