"use strict";

/**
 * A set of functions called "actions" for `user-screens`
 */

module.exports = {
  getUserScreens: async (ctx) => {
    const user = ctx.state.user;
    console.log(JSON.stringify(user));

    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }

    strapi.entityService
      .findMany("api::screen.screen", {
        filter: { data: { owner: user } },
        populate: { screenImage: { populate: "image" } },
      })
      .then((result) => {
        ctx.send(result);
      });
  },
};
