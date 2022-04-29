const returnedRoutes = () => {
  let routesOption;

  try {
    routesOption = _PF_DOCS_ROUTES_OPT
  } catch (e) {
    routesOption = undefined;
  }

  return {
    ...routesOption
  };
};

module.exports = returnedRoutes();
