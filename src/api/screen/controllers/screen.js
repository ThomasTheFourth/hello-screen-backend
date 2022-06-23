"use strict";

/**
 *  screen controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const puppeteer = require("puppeteer");
const FormData = require("form-data");
const fetch = require("isomorphic-fetch");
const fs = require("fs");
const {
  default: entityService,
} = require("@strapi/strapi/lib/services/entity-service");
module.exports = createCoreController("api::screen.screen", ({ strapi }) => ({
  async create(ctx) {
    const response = await super.create(ctx);
    updateRenderedScreen(ctx, response.data.id);
    return response;
  },

  async update(ctx) {
    const response = await super.update(ctx);
    // console.log(response);
    updateRenderedScreen(ctx, response.data.id);
    return response;
  },
}));

const updateRenderedScreen = async (ctx, id) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [`--window-size=3840,2160`],
    defaultViewport: {
      width: 3840,
      height: 2160,
    },
  });

  const page = await browser.newPage();
  await page.goto(`http://localhost:3000/screens/renderer/${id}`);

  setTimeout(async () => {
    const fileName = `rendered-image-${id}.png`;

    await page.screenshot({ path: `./public/temp/${fileName}` });

    const screen = await strapi.entityService.findOne(
      "api::screen.screen",
      id,
      {
        populate: ["screenImage"],
      }
    );

    let file = await fetch(`http://localhost:1337/temp/${fileName}`).then((r) =>
      r.blob()
    );

    const form = new FormData();

    form.append(
      "files",
      fs.createReadStream(`./public/temp/${fileName}`),
      fileName
    );

    const response = await fetch("http://localhost:1337/api/upload", {
      method: "post",
      body: form,
      headers: {
        cookie: `token=${ctx.cookies.get("token")}`,
      },
    });

    console.log(response.body);

    const newImage = await strapi.entityService.findMany(
      "plugin::upload.content-api",
      {
        filters: { title: "Hello World" },
      }
    );
    console.log(newImage);
    if (newImage.screenImage) {
    } else {
      console.log("here");
      console.log(newImage.headers);
      console.log(screen);
      // const newScreenImage = await strapi.entityService.create(
      //   "api::screen-image.screen-image",
      //   {
      //     data: { media: newImage.data.id },
      //   }
      // );
    }

    await browser.close();
  }, 1000);
};
