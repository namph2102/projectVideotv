const express = require("express");
const Route = express.Router();
const FilmDetailController = require("../app/controller/FilmDetailController");
// path parent /filmdetail
Route.post("/", FilmDetailController.init);
Route.post("/addListFilm", FilmDetailController.adlistFilm);
module.exports = Route;
