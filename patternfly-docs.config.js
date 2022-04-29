const generatedSideNav = require('./scripts/generated.sidenav');

module.exports = {
  sideNavItems: [
    ...generatedSideNav
  ],
  topNavItems: [],
  port: _PF_DOCS_PORT_OPT
};
