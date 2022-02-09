const Joi = require('joi');

module.exports = {
  // POST /v1/log/add
  register: {
    body: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      accountId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      groupId: Joi.string()
        .required(),
      accountName: Joi.string()
        .required(),
      accountNumber: Joi.string()
        .required(),
      balance: Joi.string()
        .required(),
      currency: Joi.string()
        .required(),
      bank: Joi.string()
        .required(),
      type: Joi.string()
        .required(),
      bvn: Joi.string()
        .required(),
      
      lastUpdatedTime: Joi.string(),
    },
  },

};
