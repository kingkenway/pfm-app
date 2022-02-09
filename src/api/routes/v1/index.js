const express = require("express");
// const homeRoute = require('./home.route');
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const accountRoutes = require("./account.route");
const categoryRoutes = require("./category.route");
const logRoutes = require("./log.route");
const serviceRoutes = require("./service.route");
const transactionRoutes = require("./transaction.route");

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/statusx", (req, res) => res.send("OK"));

/**
 * GET v1/docs
 */
router.use("/docs", express.static("docs"));

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/accounts", accountRoutes);
router.use("/categories", categoryRoutes);
router.use("/logs", logRoutes);
router.use("/transactions", transactionRoutes);
router.use("/services", serviceRoutes);

// router.use('/', homeRoute);

module.exports = router;

const { Mono } = require("mono-node");

// set the secret key
const monoClient = new Mono({
  secretKey: process.env["MONO_SECRET_KEY"],
});

// get your Mono Wallet balance

(async () => {
  const data = await monoClient.user.walletBalance((err, results) => {
    // Handle errors
    console.log("balance");
    if (err) {
      console.log(err);
    }
    if (results) {
      console.log(results);
    }
  });
})();

// console.log({ data });
