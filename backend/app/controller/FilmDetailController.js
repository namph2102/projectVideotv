const FimlDeltailModel = require("../models/FimlDeltailModel");
const FilmModel = require("../models/FimlModel");
class FilmDetailController {
  static handleListEsopide(list = []) {
    return list.split("*").map((item) => {
      const [esopide, link] = item.split("|");
      return { esopide: `Tập ${esopide}`, link };
    });
  }
  async init(req, res) {
    const slug = req.body.slug;
    console.log(slug);
    try {
      const findFilm = await FilmModel.findOne({ slug });
      if (findFilm) {
        const filmdetail = await FimlDeltailModel.findOne({
          idFilm: findFilm._id,
        });
        res.status(200).json({ message: "oke", filmdetail, findFilm });
        return;
      }
      throw new Error("cant find film");
    } catch {
      res.status(203).json({ message: "cant find film" });
    }
  }
  async adlistFilm(req, res) {
    const { idFilm, embed, m3u8 } = req.body;
    const listEsopideStream = FilmDetailController.handleListEsopide(m3u8);
    const listEsopideEmbeded = FilmDetailController.handleListEsopide(embed);
    const createFilm = await FimlDeltailModel.create({
      idFilm,
      listEsopideStream,
      listEsopideEmbeded,
    });
    res.status(200).json({ message: "oke", createFilm });
  }
}
module.exports = new FilmDetailController();
