const httpStatus = require("http-status");
const moment = require("moment-timezone");
const { omit } = require("lodash");
const Category = require("../models/category.model");

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.addCategory = async (req, res, next) => {
  try {
    const categoryData = req.body;
    const category = await new Category(categoryData).save();
    res.status(httpStatus.CREATED);
    return res.json({ data: category });
  } catch (error) {
    return next(error);
  }
};

// get all categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ userId: req.user._id });
    res.status(httpStatus.OK);
    return res.json({ data: categories });
  } catch (error) {
    return next(error);
  }
};
