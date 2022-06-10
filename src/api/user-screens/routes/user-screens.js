module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-screens",
      handler: "user-screens.getUserScreens",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
