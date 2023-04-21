const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FilmDetailModel = new Schema({
  idFilm: { type: mongoose.Schema.Types.ObjectId, ref: "Films" },
  listEsopideStream: { type: Array, require: true },
  listEsopideEmbeded: { type: Array, require: true },
});
module.exports = mongoose.model("fimldetails", FilmDetailModel);
