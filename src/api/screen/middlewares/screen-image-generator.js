'use strict';

/**
 * `screen-image-generator` middleware.
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In screen-image-generator middleware.');

    await next();
  };
};
