const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/category.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  register,
} = require('../../validations/category.validation');

const router = express.Router();

// /**
//  * Load user when API with userId route parameter is hit
//  */
// router.param('userId', controller.load);

router
    .route('/')
    .get(authorize(LOGGED_USER), controller.getCategories)
    .post(authorize(LOGGED_USER), validate(register), controller.addCategory);


module.exports = router;