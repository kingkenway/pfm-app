const Joi = require('joi');

module.exports = {
  // POST /v1/transaction/add
  register: {
    body: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      accountId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      groupId: Joi.string()
        .required(),
      amount: Joi.string()
        .required(),
      narration: Joi.string()
        .required(),
      date: Joi.string()
        .required(),
      type: Joi.string()
        .required(),
      category: Joi.string(),
    },
  },

};
