"use strict";

/**
 * A set of functions called "actions" for `user-screens`
 */

module.exports = {
  getUserScreens: async (ctx, next) => {
    const user = ctx.state.user;
    debugger;
    console.log(user);
    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }

    const data = await strapi.services.screens.find({ user: user.id });

    if (!data) {
      return ctx.notFound();
    }

    ctx.send(data);
  },
};
