const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

// const crypto = require('crypto');
// const moment = require('moment-timezone');

/**
 * Transaction Schema
 * @private
 */
const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    // required: true,
    index: true,
  },
  transactionId: {
    type: 'String',
    // required: true,
    default: '',
  },
  amount: {
    type: 'String',
    required: true,
    default: '',
  },
  date: {
    type: 'String',
    required: true,
    default: '',
  },
  narration: {
    type: 'String',
    required: true,
    default: '',
  },
  type: {
    type: 'String',
    required: true,
    default: '',
  },
  category: {
    type: 'String',
    default: '',
  },
  balance: {
    type: 'Number',
    required: true,
  },
//   expires: { type: Date },
});

transactionSchema.statics = {

  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {Transaction} transaction
   * @returns {Transaction}
   */
  generate(transaction) {
    const userId = transaction.userId;
    const accountId = transaction.accountId;
    const transactionId = transaction.transactionId;
    const amount = transaction.amount;
    const date = transaction.date;
    const narration = transaction.narration;
    const type = transaction.type;
    const balance = transaction.balance;
    
    const transactionObject = new Transaction({
        // accountId,amount,narration,date,type,category
        userId,accountId,transactionId,amount,date,narration,type,balance
    });
    transactionObject.save();
    return transactionObject;
  },
};

transactionSchema.plugin(mongoosePaginate);

/**
 * @typedef Transaction
 */
const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
