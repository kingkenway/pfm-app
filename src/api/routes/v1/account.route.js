const express = require("express");
const validate = require("express-validation");
const controller = require("../../controllers/account.controller");
const { authorize, ADMIN, LOGGED_USER } = require("../../middlewares/auth");
const {
  register,
  setDefault,
} = require("../../validations/account.validation");

const router = express.Router();

// console.log(123)

// /**
//  * Load user when API with userId route parameter is hit
//  */
// router.param('userId', controller.load);

router.route("/").get(authorize(), controller.getAccounts);

router
  .route("/add")
  .post(authorize(LOGGED_USER), validate(register), controller.addAccount);

router
  .route("/setDefault")
  .put(
    authorize(LOGGED_USER),
    validate(setDefault),
    controller.setDefaultAccount
  );

module.exports = router;
