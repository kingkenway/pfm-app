const mongoose = require('mongoose');
// const crypto = require('crypto');
// const moment = require('moment-timezone');

/**
 * Account Schema
 * @private
 */
const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    index: true,
  },

  groupId: {
    type: 'String',
    required: true,
    default: '',
  },
  accountName: {
    type: 'String',
    required: true,
    default: '',
  },
  accountNumber: {
    type: 'String',
    required: true,
    default: '',
  },
  balance: {
    type: 'String',
    required: true,
    default: '',
  },
  currency: {
    type: 'String',
    required: true,
    default: '',
  },
  bank: {
    type: 'String',
    required: true,
    default: '',
  },
  type: {
    type: 'String',
    required: true,
    default: '',
  },
  bvn: {
    type: 'String',
    required: true,
    default: '',
  },
  
  lastUpdatedTime: {
    type: 'String',
    default: '',
  },
//   expires: { type: Date },
},{
    timestamps: true,
}
);

logSchema.statics = {

  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {Log} log
   * @returns {Log}
   */
  generate(log) {
    const accountId = account.accountId;
    const accountNumber = account.accountNumber;
    const accountBalance = account.accountBalance;
    const syncTime = account.syncTime;
    const syncType = account.syncType;
    const lastUpdatedApi = account.lastUpdatedApi;
    const logObject = new Log({
        accountId,accountNumber,accountBalance,syncTime,syncType,lastUpdatedApi,
    });
    logObject.save();
    return logObject;
  },
};

/**
 * @typedef Log
 */
const Log = mongoose.model('Log', logSchema);
module.exports = Log;
