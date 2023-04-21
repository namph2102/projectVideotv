const express = require("express");
const Router = express.Router();
const IconController = require("../app/controller/IconsController");
// path parent /icon
Router.post("/addIcon", IconController.init);
Router.post("/addIconTouser", IconController.addIconToUser);
module.exports = Router;
