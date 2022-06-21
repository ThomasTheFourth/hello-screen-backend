'use strict';

/**
 * screen service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::screen.screen');
