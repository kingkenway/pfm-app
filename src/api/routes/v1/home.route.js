const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/log.controller');
const router = express.Router();

// /**
//  * Load user when API with userId route parameter is hit
//  */
// router.param('userId', controller.load);

const publicRoot = '../../../ds_monitor_frontend/build';

router
    .route('/'), (req, res, next) => {
        res.sendFile("index.html", { root: publicRoot })
;}

module.exports = router;