const httpStatus = require("http-status");
const moment = require("moment-timezone");
const { omit } = require("lodash");
const Transaction = require("../models/transaction.model");
const retry = require("async-retry");
const Account = require("../models/account.model");
const { default: axios } = require("axios");

// (async () => {
//   const data = await Transaction.find({
//     accountId: "6196548a5132650b5f0618b5",
//   });

//   console.log({ accountId: { count: data.length } });
// })();

const getAndDumpTransactions = async ({ userId, accountId }) => {
  return await axios({
    method: "GET",
    url: `https://api.withmono.com/accounts/${accountId}/transactions?paginate=false`,
    headers: {
      "Content-Type": "application/json",
      "mono-sec-key": process.env["MONO_SECRET_KEY"],
    },
  })
    .then(async (response) => {
      console.log({ accountId });

      const transactionData = response.data.data;

      // Check if Trxs already exists.
      const result = await Transaction.find({ accountId });

      if (Array.isArray(result) && result.length) {
        console.log("START INSERTING UPDATED TRX RECORDS");
        const resultCountDifference = response.data.count - result.length;
        const resultDifference = transactionData.slice(
          0,
          resultCountDifference
        );

        if (resultDifference) {
          console.log({ resultDifference: resultDifference.length });

          // Update the transaction record with the User ID, Account ID
          const updatedTransactionDataWithIds = resultDifference.map((x) => ({
            ...x,
            transactionId: x._id,
            userId,
            accountId,
          }));
          // Delete _id, so mongodb can auto generate _id
          updatedTransactionDataWithIds.forEach((u) => delete u._id);

          // Update transactions collection with all returned transactions data
          const updatedData = await Transaction.insertMany(
            updatedTransactionDataWithIds
          );
          console.log("END INSERTING UPDATED TRX RECORDS");
        }
      } else {
        console.log("START INSERTING NEW TRX RECORDS");
        // Update the transaction record with the User ID, Account ID
        console.log({ transactionCount: response.data.count });
        const updatedTransactionDataWithIds = transactionData.map((x) => ({
          ...x,
          transactionId: x._id,
          userId,
          accountId,
          balance: x.balance || 0,
        }));
        updatedTransactionDataWithIds.forEach((u) => delete u._id);
        // Update transactions with all returned transactions data
        const updatedData = await Transaction.insertMany(
          updatedTransactionDataWithIds
        );
        console.log("END INSERTING NEW TRX RECORDS");
      }
    })
    .catch((error) => {
      // return next(error);
      console.log("WE GET AN ERROR 000");
      console.error(error);
      return false;
    });
};

// ---

exports.syncAccountsTransactions = async (req, res, next) => {
  try {
    // Find all linked accounts by user in DB
    const accounts = await Account.find({
      userId: req.user._id,
      isUnlinked: false,
    });
    let state = {};

    if (Array.isArray(accounts) && accounts.length) {
      accounts.forEach(async (element, index) => {
        const status = await getAndDumpTransactions({
          userId: req.user._id,
          accountId: element.accountId,
        });
        state[element.accountId] = status;
      });
    }
    console.log({ state });
    return res.json({ state });
  } catch (error) {
    return next(error);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    // const result = await Transaction.find( {accountId: req.params.accountId} );
    // const result = await Transaction.paginate({accountId: req.params.accountId}).then({}); // Usage

    const limit = req.query.limit || 5;
    const options = {
      sort: { date: -1 },
      // lean: true,
      // offset: 20,
      limit,
      customLabels: { docs: "data" },
    };

    const result = await Transaction.paginate(
      { accountId: req.params.accountId },
      options
    ).then(function (res) {
      return res;
    });

    return res.json(result);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.categorizeTransaction = async (req, res, next) => {
  try {
    console.log("Inside categorizeTransaction()");
    console.log(req.params);
    console.log(req.body);

    const response = await Transaction.findOneAndUpdate(
      { transactionId: req.params.transactionId },
      { category: req.body.category }
    );
    console.log({ response });
    return res.json(response);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

(async () => {
  // const result = await Transaction.findOneAndUpdate({transactionId: "617f1aa4dedf2e7a154462b1"}, {category: "req.body.category.body"})
  // console.log({result})
  // const result = await Transaction.find( {accountId:"617f1a7ededf2e7a15446291"});
  // console.log(result.length);
  // const dat = await Transaction.paginate().then({}); // Usage
  // console.log(dat)
  // await  Transaction.generate({
  //     "transactionId": "617f1aa4dedf2e7a154462bz",
  //     "amount": "19900",
  //     "date": "2021-11-30T23:07:12.000Z",
  //     "narration": "FAAJI lelele",
  //     "type": "debit",
  //     "category": "stamp_duties_charges",
  //     "balance": 14213,
  //     "userId": "617977bfacd74b11bd756b17",
  //     "accountId": "617f1a7ededf2e7a15446290",
  // },)
})();
