// const Account = require('../models/account.model');
// const MAX_TRYS = 4; TRY_TIMEOUT = 5000;


// const toTry = async (accountId) => {
//     return new Promise((resolve, reject) => {
//         setTimeout(async () => {
//             return await Account.findOne({accountId})
//                 .then(res => { res==null ? reject('Error') : resolve(res.userId)})
//                 .catch(() => { reject('Error') })
//         }, TRY_TIMEOUT)
//     })
// }

// const tryNTimes = async (toTry, count = MAX_TRYS) => {
//     if (count > 0) {
//         console.log(count);
//         const result = await toTry().catch(e => e);
//         if (result === "Error") { return await tryNTimes(toTry, count - 1) }             
//         return result
//     }
//     // return `Tried checking if account was created, but failed ${MAX_TRYS} times.`;
//     return false;
// }

// // tryNTimes(toTry).then(console.log);

// module.exports = {
//     toTry,
//     tryNTimes,
// }