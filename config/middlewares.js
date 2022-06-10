module.exports = [
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      credentials: true,
      headers: ["Content-Type", "*"],
      origin: [
        "http://localhost:1337",
        "http://localhost:3000",
        "https://helloscreen.app",
      ],
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
