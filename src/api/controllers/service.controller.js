const httpStatus = require("http-status");
const moment = require("moment-timezone");
const { omit } = require("lodash");
const fetch = require("node-fetch");
const axios = require("axios");
const logger = require("../../config/logger");
const Log = require("../models/log.model");
const Account = require("../models/account.model");
const Transaction = require("../models/transaction.model");
// const retrial = require('../utils/retrial');
const crypto = require("crypto");
const retry = require("async-retry");

//   try {
//     const accountData = req.body;
//     const account = await new Account(accountData).save();
//     res.status(httpStatus.CREATED);
//     return res.json({ data: account });
//   } catch (error) {
//     return next(error);
//   }
// };

// const MAX_TRYS = 4; TRY_TIMEOUT = 5000;

// async function toTry(accountId) {
//     return new Promise((resolve, reject) => {
//         setTimeout(async () => {
//             return await Account.findOne({accountId})
//                 .then(res => { res==null ? reject('Error') : resolve(res.userId)})
//                 .catch(() => { reject('Error') })
//         }, TRY_TIMEOUT)
//     })
// }

// async function tryNTimes(functiontoTry, count = MAX_TRYS) {
//     if (count > 0) {
//         console.log(count);
//         const result = await toTry().catch(e => e);
//         if (result === "Error") { return await tryNTimes(toTry, count - 1) }
//         return result
//     }
//     // return `Tried checking if account was created, but failed ${MAX_TRYS} times.`;
//     return false;
// }

exports.manualDataSyncTrigger = async (accountId) => {
  try {
    await axios({
      method: "POST",
      url: `https://api.withmono.com/accounts/${accountId}/sync`,
      headers: {
        "Content-Type": "application/json",
        "mono-sec-key": process.env["MONO_SECRET_KEY"],
      },
    })
      .then(async (response) => {
        console.log({ dataSyncResponse: response.data.data });
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        // return next(error);
      });
  } catch (error) {
    console.log(error);
    // return next(error);
  }
};

// const getTransactions = async (id) => {
//     return await axios({
//         method: 'GET',
//         url: `https://api.withmono.com/accounts/${id}/transactions`,
//         headers: { 'Content-Type': 'application/json','mono-sec-key': process.env['MONO_SECRET_KEY'] },
//     })
//     .then(response => {
//         return response.data.data.slice(0,3);
//     })
//     .catch(error => {
//         // return next(error);
//         console.log('Error from getTransactions: '+error);
//     });
// };

// 610b08a17b474528be50d106
const getUserIdFromAccountId = async (accountId) => {
  try {
    return await retry(
      async (bail, attempt) => {
        console.log(`First account(${accountId}) check Call at ${attempt}`);
        const data = await Account.findOne({ accountId });
        if (data == null) {
          // bail(new Error('Unauthorized'))
          // throw new Error(`onRetry error at ${attempt}`);
          throw Error(`account-not-created-yet`);
          return;
        }
        return data.userId;
      },
      { onRetry: (e, attempt) => {}, retries: 3 }
    );
  } catch (e) {
    return false;
    console.error("Error:  ", e.message);
  }
};

const getAccountInformation = async (id) => {
  return await axios({
    method: "GET",
    url: `https://api.withmono.com/accounts/${id}`,
    headers: {
      "Content-Type": "application/json",
      "mono-sec-key": process.env["MONO_SECRET_KEY"],
    },
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      // return next(error);
      console.log("Error from getAccountInformation: " + error);
    });
};

exports.getAccountId = async (req, res, next) => {
  try {
    await axios({
      method: "POST",
      url: "https://api.withmono.com/account/auth",
      data: { code: req.body.code },
      headers: {
        "Content-Type": "application/json",
        "mono-sec-key": process.env["MONO_SECRET_KEY"],
      },
    })
      .then(async (response) => {
        res.status(httpStatus.OK);
        const data = await getAccountInformation(response.data.id);
        return res.json(data);
      })
      .catch(function (error) {
        return next(error);
      });
  } catch (error) {
    return next(error);
  }
};

exports.initiateDataSync = async (req, res, next) => {
  try {
    console.log({ accountId: req.params.accountId });
    await axios({
      method: "POST",
      url: `https://api.withmono.com/accounts/${req.params.accountId}/sync`,
      headers: {
        "Content-Type": "application/json",
        "mono-sec-key": process.env["MONO_SECRET_KEY"],
      },
    })
      .then(async (response) => {
        console.log("Inside initiateDataSync: >>>>", response.data);
        console.log({ response: response.data });
        res.status(httpStatus.OK);
        if (response.data.code == "SYNC_SUCCESSFUL") {
          return res.json({ message: "SYNC_SUCCESSFUL" });
        } else if (response.data.code == "REAUTHORISATION_REQUIRED") {
          // Update user re-auth status
          await Account.updateOne(
            { accountId: req.params.accountId },
            { $set: { reauthRequired: true } },
            { new: true },
            function (err, res) {}
          );
          return res.json({
            message: "REAUTHORISATION_REQUIRED",
            message2: response.data.message || "",
          });
        } else {
          return res.json({
            message: "SYNC_ERROR",
            message2: response.data.message || "",
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        return next(error);
      });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.reauthToken = async (req, res, next) => {
  try {
    await axios({
      method: "POST",
      url: `https://api.withmono.com/accounts/${req.params.accountId}/reauthorise`,
      headers: {
        "Content-Type": "application/json",
        "mono-sec-key": process.env["MONO_SECRET_KEY"],
      },
    })
      .then(async (response) => {
        res.status(httpStatus.OK);
        console.log("IN REAUTH..........");
        console.log(response.data.token);
        if (
          response.data &&
          response.data.message == "This account can not be re-authorised."
        ) {
          return res.json({ message: response.data.message });
        } else if (response.data.token) {
          return res.json({ message: response.data.token });
        }
      })
      .catch(function (error) {
        res.status(httpStatus.BAD_REQUEST);
        return res.json({ message: error.response.data.message });
        // return next(error);
      });
  } catch (error) {
    // console.log(error.data);
    // return next(error);
  }
};

exports.triggerWebhook = async (req, res, next) => {
  if (req.headers["mono-webhook-secret"] !== process.env["MONO_WEBHOOK_KEY"]) {
    return res.status(401).json({
      message: "Unauthorized request.",
    });
  } else {
    const webhook = req.body;
    console.log("RECEIVED WEBHOOK");
    console.log(webhook.event);

    // res.status(httpStatus.OK);
    return res.json({ ok: 200 });

    // Check webhook event
    if (webhook.event == "mono.events.account_updated") {
      // Account Updated webhooks

      if (webhook.data.meta.data_status == "AVAILABLE") {
        // AVAILABLE, PROCESSING, FAILED
        const data = webhook.data.account;
        console.log(`mono.events.account_updated=>${data._id}`);

        console.log(data);

        // The thing here is, webhooks can come in faster than when an account get's created from the frontend to the db.
        // Also, it's of utmost importance that we store this webhook log with the User/owner Id of this account.
        // Now, we can't store this log unless we are sure that an account has already being created, which is why we check
        // if an account has already being created.

        // Pass Account Id, to fetch User Id
        const userId = await getUserIdFromAccountId(data._id);

        if (userId) {
          const groupId = crypto.randomBytes(16).toString("hex");
          const logData = {
            userId: userId,
            accountId: data._id,
            accountName: data.name || "n/a",
            accountNumber: data.accountNumber || "n/a",
            balance: data.balance || "n/a",
            currency: data.currency || "n/a",
            bank: data.institution.name || "n/a", // name:bankCode:type
            type: data.type || "n/a",
            bvn: data.bvn || "n/a",
            lastUpdatedTime: data.updated_at || "n/a",
            groupId,
          };

          // Log data to DB
          const log = await new Log(logData).save();

          // Update user acount balance and re-auth status
          await Account.updateOne(
            { accountId: data._id },
            { $set: { balance: data.balance, reauthRequired: false } },
            { new: true },
            function (err, res) {}
          );

          // Fetch transactions as at logged time
          const transactions = await getTransactions(data._id);

          // Log 3 most recent transactions as at last update
          transactions.forEach(async (element) => {
            await new Transaction({
              userId,
              accountId: data._id,
              groupId,
              type: element.type || "n/a",
              date: element.date || "n/a",
              narration: element.narration || "n/a",
              amount: element.amount || "n/a",
              balance: element.balance || "n/a",
            }).save();
          });
        }

        return res.json({ ok: 200 });
      }
    } else if (webhook.event == "mono.events.reauthorisation_required") {
      // Account Reauthorisation required webhook
      res.status(httpStatus.OK);
      // Update reauthRequired status to false in DB
      const accountId = webhook.data.account._id;
      console.log(`mono.events.reauthorisation_required=>${accountId}`);
      await Account.updateOne(
        { accountId },
        { $set: { reauthRequired: true } },
        { new: true },
        function (err, res) {}
      );
    } else if (webhook.event == "mono.events.account_reauthorized") {
      // Account Reauthorisation success webhook
      res.status(httpStatus.OK);
      // Update reauthRequired status to false in DB
      const accountId = webhook.data.account._id;
      console.log(`mono.events.account_reauthorized=>${accountId}`);
      await Account.updateOne(
        { accountId },
        { $set: { reauthRequired: false } },
        { new: true },
        function (err, res) {}
      );
    }
  }
};
