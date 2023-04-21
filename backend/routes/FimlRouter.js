const express = require("express");
const Router = express.Router();
const FilmController = require("../app/controller/FilmController");

// root parent /api
Router.get("/v2", FilmController.init).get(
  "/v2/banner",
  FilmController.getBanners
);

Router.get("/v3/kinds", FilmController.showKind).get(
  "/v3/home",
  FilmController.showHome
);

// client get values
Router.post("/film", FilmController.getFilmDetail)
  .post("/updateLike", FilmController.updateLike)
  .post("/updateView", FilmController.updateView)
  .post("/pagefilm", FilmController.getFilmFollowPage)
  .post("/findlistfilmsame", FilmController.listFilmSame)
  .get("/listsub", FilmController.getListSubmenu);
module.exports = Router;
