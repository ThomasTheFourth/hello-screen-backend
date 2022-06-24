"use strict";

/**
 *  screen controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const puppeteer = require("puppeteer");
const FormData = require("form-data");
const fetch = require("isomorphic-fetch");
const fs = require("fs");

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

  const fileName = `rendered-image-${id}.png`;

  const tempFile = `./public/temp/${fileName}`;

  await page.screenshot({ path: tempFile });

  const screen = await strapi.entityService.findOne("api::screen.screen", id, {
    populate: ["screenImage"],
  });

  const form = new FormData();

  form.append(
    "files",
    fs.createReadStream(`./public/temp/${fileName}`),
    fileName
  );

  await fetch("http://localhost:1337/api/upload", {
    method: "post",
    body: form,
    headers: {
      cookie: `token=${ctx.cookies.get("token")}`,
    },
  });

  const images = await strapi.entityService.findMany("plugin::upload.file", {
    filters: {
      name: fileName,
    },
  });

  let screenImage;
  if (screen.screenImage) {
    await strapi.entityService.delete("plugin::upload.file", images[0].id);
    images.shift();
    await strapi.entityService.update(
      "api::screen-image.screen-image",
      screen.screenImage.id,
      {
        data: { image: images[0] },
      }
    );
  } else {
    screenImage = await strapi.entityService.create(
      "api::screen-image.screen-image",
      {
        data: { image: images[0] },
      }
    );
    await strapi.entityService.update("api::screen.screen", screen.id, {
      data: { screenImage: screenImage },
    });
  }

  fs.unlinkSync(tempFile);

  await browser.close();
};
