const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/service.controller");
const { authorize, ADMIN, LOGGED_USER } = require("../../middlewares/auth");
// const {
//   register,
// } = require('../../validations/service.validation');

const router = express.Router();

// /**
//  * Load user when API with userId route parameter is hit
//  */
// router.param('userId', controller.load);

router.route("/account-id").post(authorize(), controller.getAccountId);

// router
//     .route('/webhook')
//     .post(controller.triggerWebhook)

// router
//     .route('/sync/:accountId')
//     .get(authorize(), controller.initiateDataSync)

// router
//     .route('/reauth/:accountId')
//     .get(authorize(), controller.reauthToken)

// ---

// router
//     .route('/add')
//     .post(authorize(LOGGED_USER), validate(register), controller.addAccount);

module.exports = router;
