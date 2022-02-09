const Joi = require("joi");

module.exports = {
  // POST /v1/account/add
  register: {
    body: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
      accountId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
      accountName: Joi.string().required(),
      accountNumber: Joi.string().required(),
      balance: Joi.string().required(),
      currency: Joi.string().required(),
      bank: Joi.string().required(),
      type: Joi.string().required(),
      bvn: Joi.string().required(),
      reauthRequired: Joi.boolean(),
      isUnlinked: Joi.boolean(),
    },
  },

  setDefault: {
    body: {
      accountId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },
};
