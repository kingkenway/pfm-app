const httpStatus = require('http-status');
const moment = require('moment-timezone');
const { omit } = require('lodash');
const User = require('../models/user.model');
const Account = require('../models/account.model');
const Trx = require('../models/transaction.model');
const RefreshToken = require('../models/refreshToken.model');
const PasswordResetToken = require('../models/passwordResetToken.model');
const { jwtExpirationInterval } = require('../../config/vars');
const APIError = require('../errors/api-error');
const emailProvider = require('../services/emails/emailProvider');
const { manualDataSyncTrigger } = require('./service.controller');
const axios = require('axios');


/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

// async function syncDataManually(accountId){

//   const result = await 
  
// }

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const userData = omit(req.body, 'role');
    const user = await new User(userData).save();
    const userTransformed = user.transform();
    const token = generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */

exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();

    // Get all accounts
    const accounts = await Account.find({ userId: user._id, isUnlinked: false });

    if (Array.isArray(accounts) && accounts.length) {
      // If accounts found, inititate Data Sync Manually
      accounts.forEach( async (element, index) => {
        console.log(index, element.accountId);
        const dataSyncResponse = await manualDataSyncTrigger(element.accountId);
      });

      console.log('foundddddd')
    }

    return res.json({ token, user: userTransformed, accounts });
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

exports.sendPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();

    if (user) {
      const passwordResetObj = await PasswordResetToken.generate(user);
      emailProvider.sendPasswordReset(passwordResetObj);
      res.status(httpStatus.OK);
      return res.json('success');
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: 'No account found with that email',
    });
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password, resetToken } = req.body;
    const resetTokenObject = await PasswordResetToken.findOneAndRemove({
      userEmail: email,
      resetToken,
    });

    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (!resetTokenObject) {
      err.message = 'Cannot find matching reset token';
      throw new APIError(err);
    }
    if (moment().isAfter(resetTokenObject.expires)) {
      err.message = 'Reset token is expired';
      throw new APIError(err);
    }

    const user = await User.findOne({ email: resetTokenObject.userEmail }).exec();
    user.password = password;
    await user.save();
    emailProvider.sendPasswordChangeEmail(user);

    res.status(httpStatus.OK);
    return res.json('Password Updated');
  } catch (error) {
    return next(error);
  }
};


// ---



const { data } = require('./data');

const { performance } = require('perf_hooks');
const AsyncRetry = require('async-retry');

 (async () => {
  // 61111c7d9ed1bc0004fc87f0 61111c7aeb8ba8427f3989d1
  //  const userId = "61111c7d9ed1bc0004fc87f0";
  //  const accountId = "61111c7aeb8ba8427f3989d1";
  //  const transactionId = "transactionId";
  //  const amount = "amount";
  //  const date = "date";
  //  const narration = "narration";
  //  const type = "type";
  //  const balance = 54321;

  //  userId,accountId,transactionId,amount,date,narration,type,balance

  //  const transactions = await new Trx({userId,accountId,transactionId,amount,date,narration,type,balance});
  //  transactions.save();

  
  // try {
    
  //   const find = await Trx.find({amount: ""});
  //   console.log(find);

  //   const myData = data.data;

  //   const startTime = performance.now()

  //   // Fetch all accounts if found;
  //     // const accounts = await Account.find({ userId: req.user._id });
  
  //   // Add the User ID, Account ID
  //   const updatedRecordWithIds = myData.map(x => ({
  //     ...x,
  //     userId: "61111c7d9ed1bc0004fc87f0",
  //     accountId: "61111c7aeb8ba8427f3989d1",
  //   }));
  
  //   const opera = await Trx.insertMany(updatedRecordWithIds);
  //   // console.log(opera);

  //   const endTime = performance.now()

  //   console.log(`Call to doSomething took ${ (endTime - startTime) /1000 } seconds`)

    
  // } catch (error) {
  //   console.log('mongoError');
  //   throw error;
  // }


})();

console.log(123);