const express = require("express");
const Route = express.Router();
const TopUpController = require("../app/controller/TopUpController");
const { Authorization } = require("../app/Authorization");
// path parent /topup
Route.post("/", Authorization, TopUpController.TopUp).post(
  "/userHistory",
  TopUpController.getHistoryToUser
);
module.exports = Route;
