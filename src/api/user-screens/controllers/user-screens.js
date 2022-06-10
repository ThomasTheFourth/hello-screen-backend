"use strict";

/**
 * A set of functions called "actions" for `user-screens`
 */

module.exports = {
  getUserScreens: async (ctx, next) => {
    const user = ctx.state.user;
    debugger;
    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }

    const data = strapi.entityService
      .findMany("api::screen.screen", {
        filter: { "User.id": user.id },
        populate: ["User"],
      })
      .then((result) => {
        console.log(result);
      });
    // const data = await strapi.services.screens.find({ user: user.id });
    console.log(data);

    if (!data) {
      return ctx.notFound();
    }

    ctx.send(data);
  },
};
