const httpStatus = require("http-status");
const moment = require("moment-timezone");
const { omit } = require("lodash");
const Account = require("../models/account.model");
const User = require("../models/user.model");

exports.addAccount = async (req, res, next) => {
  try {
    const foundAccounts = await Account.find({
      userId: req.user._id,
      isUnlinked: false,
    });
    const account = await new Account(req.body).save();

    if (!foundAccounts) {
      const response = await User.findOneAndUpdate(
        { _id: req.user._id },
        { defaultMonoAccount: req.body.accountId }
      );
    }

    res.status(httpStatus.CREATED);
    return res.json({ data: account });
  } catch (error) {
    return next(error);
  }
};

exports.getAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find({
      userId: req.user._id,
      isUnlinked: false,
    });
    res.status(httpStatus.OK);
    return res.json({ data: accounts });
  } catch (error) {
    return next(error);
  }
};

exports.setDefaultAccount = async (req, res, next) => {
  console.log("setDefaultAccount");
  // req.user._id
  try {
    const response = await User.findOneAndUpdate(
      { _id: req.user._id },
      { defaultMonoAccount: req.body.accountId }
    );
    console.log({ response: response.transform() });
    return res.json(response.transform());
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
