const mongoose = require('mongoose');
// const crypto = require('crypto');
// const moment = require('moment-timezone');

/**
 * Account Schema
 * @private
 */
const categorySchema = new mongoose.Schema({
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
  name: {
    type: 'String',
    required: true,
    default: '',
  },
//   expires: { type: Date },
},{
    timestamps: true,
}
);

categorySchema.statics = {

  /**
   * Generate a refresh token object and saves it into the database
   *
   * @param {Category} category
   * @returns {Category}
   */
  generate(category) {
    const accountId = category.accountId;
    const userId = category.userId;
    const name = category.name;
    const categoryObject = new Category({
        accountId,userId,name
    });
    categoryObject.save();
    return categoryObject;
  },
};

/**
 * @typedef Category
 */
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
