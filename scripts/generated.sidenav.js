const generatedRoutes = require(require('path').join(_PF_DOCS_PACKAGE_PWD, 'src/generated'));
const sideNav = [];

Object.entries(generatedRoutes).forEach(([key, { section }]) => {
  const nav = {};
  const text = key.split('/')[1];

  if (section && section !== '') {
    if (sideNav.find(({ section: cur }) => cur === section)) {
      return;
    }
    nav.section = section;
  } else {
    nav.text = text.charAt(0).toUpperCase() + text.slice(1);
    nav.href = key;
  }

  sideNav.push(nav);
});

module.exports = sideNav;
