const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/transaction.controller");
const { authorize, ADMIN, LOGGED_USER } = require("../../middlewares/auth");
// const {
//   register,
// } = require('../../validations/log.validation');

const router = express.Router();

// /**
//  * Load user when API with userId route parameter is hit
//  */
// router.param('userId', controller.load);

router
  .route("/categorize/:transactionId")
  .put(authorize(LOGGED_USER), controller.categorizeTransaction);

router
  // .route('/:groupId')
  .route("/syncAccountsTrx")
  .get(authorize(LOGGED_USER), controller.syncAccountsTransactions);

router
  .route("/:accountId")
  .get(authorize(LOGGED_USER), controller.getTransactions);

module.exports = router;
