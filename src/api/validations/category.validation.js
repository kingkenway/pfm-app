const Joi = require('joi');

module.exports = {
  // POST /v1/category/add
  register: {
    body: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      accountId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      name: Joi.string().required(),
    },
  },

};
