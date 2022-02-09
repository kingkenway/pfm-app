const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/log.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  register,
} = require('../../validations/log.validation');

const router = express.Router();

// /**
//  * Load user when API with userId route parameter is hit
//  */
// router.param('userId', controller.load);

router
    .route('/')
    .get(authorize(LOGGED_USER), controller.getLogs)

router
    .route('/add')
    .post(authorize(LOGGED_USER), validate(register), controller.addLog);

module.exports = router;