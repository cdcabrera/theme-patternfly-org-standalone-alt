const generatedSideNav = require('./scripts/generated.sidenav');

module.exports = {
  sideNavItems: [
    ...generatedSideNav
  ],
  topNavItems: [],
  port: 8003
};
