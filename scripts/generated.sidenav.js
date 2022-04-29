const generatedRoutes = require(require('path').join(process.cwd(), 'src/generated'));
const sideNav = [];
const sections = [];

Object.entries(generatedRoutes).forEach(([key]) => {
  let section = key.split('/')[1];
  section = section.charAt(0).toUpperCase() + section.slice(1);
  !sections.includes(section) && sections.push(section);
});

sections.forEach(sectionName => {
  sideNav.push({
    section: sectionName
  });
});

module.exports = sideNav;
