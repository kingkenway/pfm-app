const mongoose = require('mongoose');
// const crypto = require('crypto');
// const moment = require('moment-timezone');

/**
 * Account Schema
 * @private
 */
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  accountId: {
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
  reauthRequired: {
    type: 'Boolean',
    default: false,
  },
  isUnlinked: {
    type: 'Boolean',
    default: false,
  },
  dataStatus: {
    type: 'Boolean',
    default: false,
  },
//   expires: { type: Date },
},{
    timestamps: true,
}
);

accountSchema.statics = {

  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {Account} account
   * @returns {Account}
   */
  generate(account) {
    const userId = account.userId;
    const accountName = account.accountName;
    const accountNumber = account.accountNumber;
    const bank = account.bank;
    const type = account.type;
    const bvn = account.bvn;
    const reauthRequired = account.reauthRequired;
    const isUnlinked = account.isUnlinked;
    const accountObject = new Transaction({
        userId,accountName,accountNumber,bank,type,bvn,reauthRequired,isUnlinked,
    });
    accountObject.save();
    return accountObject;
  },
};

/**
 * @typedef Account
 */
const Account = mongoose.model('Account', accountSchema);
module.exports = Account;
