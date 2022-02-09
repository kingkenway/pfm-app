const httpStatus = require('http-status');
const moment = require('moment-timezone');
const { omit } = require('lodash');
const Log = require('../models/log.model');

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.addLog = async (req, res, next) => {
  try {
    const logData = req.body;
    const log = await new Log(logData).save();
    res.status(httpStatus.CREATED);
    return res.json({ data: log });
  } catch (error) {
    return next(error);
  }
};

exports.getLogs = async (req, res, next) => {
    try {
        const logs = await Log.find({ userId: req.user._id });
        res.status(httpStatus.OK);
        return res.json({ data: logs });
    } catch (error) {
        return next(error);
    }
  };
  