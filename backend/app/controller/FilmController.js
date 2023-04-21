const FimlsModel = require("../models/FimlModel");
const CategoryModel = require("../models/CategoryModel");
const CountryModel = require("../models/CountryModel");
const Bonus = require("../utils/UserUtil");
class FimlController {
  async init(req, res) {
    try {
      const listfilms = await FimlsModel.find({})
        .select("name slug _id origin_name thumb_url")
        .lean();
      res.status(200).json({
        status: 200,
        message: "OK",
        type: "All Films",
        data: listfilms,
      });
    } catch {
      return res.status(404).json({
        status: 404,
        message: "Sorry~ Cannot get llist Film",
        data: [],
      });
    }
  }
  async getBanners(_, res) {
    try {
      const listfilms = await FimlsModel.find()
        .sort({ view: -1 })
        .limit(6)
        .select("name _id origin_name poster_url slug");
      res.status(200).json({
        status: 200,
        message: "Only get six banner",
        data: listfilms,
      });
    } catch (err) {
      res.stauts(404).json({
        status: 404,
        message: "Fall to get banner ",
        data: [],
      });
    }
  }
  async showHome(_, res) {
    try {
      const listfilms = await FimlsModel.find()
        .sort({ updated_at: -1 })
        .limit(20);
      res.status(200).json({
        status: 200,
        message: "20 Films views Home",
        data: listfilms,
      });
    } catch (err) {
      res.stauts(404).json({
        status: 404,
        message: "Fall to get value view home ",
        data: [],
      });
    }
  }
  async showKind(_, res) {
    try {
      const resfeature = FimlsModel.find({ kind: "feature" })
        .sort({ view: -1 })
        .limit(6);
      const resseries = FimlsModel.find({ kind: "series" })
        .sort({ view: -1 })
        .limit(6);
      const [feature, series] = await Promise.all([resfeature, resseries]);
      res.status(200).json({
        status: 200,
        message: "oke",
        data: { feature, series },
      });
    } catch (err) {
      res.status(404).json({
        status: 404,
        message: "Fall to get :((",
        data: [],
      });
    }
  }
  async getFilmDetail(req, res) {
    try {
      const { slug } = req.body;
      if (!slug) throw new Error("Can't find slug");
      const film = await FimlsModel.findOne({ slug });

      if (film) {
        return res.status(200).json({
          message: "Lấy thành công phim chi tiết !",
          status: 200,
          film,
        });
      } else {
        return res
          .status(404)
          .json({ message: "Không tìm thấy phim đó !", status: 404, film: "" });
      }
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Server Error !", status: 400, film: "" });
    }
  }
  async getListSubmenu(req, res) {
    try {
      const [categories, countries] = await Promise.all([
        CategoryModel.find(),
        CountryModel.find(),
      ]);
      res.status(200).json({
        message: "Get list categories and  countries success",
        categories,
        countries,
        status: 200,
      });
    } catch {
      res.status(200).json({ categories: [], countries: [], staus: 404 });
    }
  }
  async getFilmFollowPage(req, res) {
    try {
      let subName = "";
      const filmInPage = 16;
      const { kind, slug, page } = req.body.data;
      const skip = page * filmInPage;
      let options = {};
      switch (kind) {
        case "phim-le":
          options = { kind: "feature" };
          break;
        case "phim-hoan-thanh":
          options = {
            $expr: { $eq: ["$episode_current", "$eposode_total"] },
          };
          break;
        case "phim-dang-chieu":
          options = {
            $expr: { $lt: ["$episode_current", "$eposode_total"] },
          };
          break;
        case "phim-sap-chieu":
          options = {
            trailer: true,
          };
          break;
        case "xem-tat-ca":
          options = {};
          break;
        case "the-loai":
          console.log(slug);
          if (slug) {
            const findCate = await CategoryModel.findOne({ slug });
            if (findCate) {
              subName = findCate.category;
              options = { category: { $in: [subName] } };
            } else {
              listResultPromise = [0, []];
            }
          } else {
            throw new Error("Can't find slug catogory");
          }
          break;
        case "quoc-gia":
          console.log(slug);
          if (slug) {
            const findCountry = await CountryModel.findOne({ slug });
            if (findCountry) {
              subName = findCountry.country;
              options = { country: findCountry._id };
            } else {
              listResultPromise = [0, []];
            }
          } else {
            throw new Error("Can't find slug catogory");
          }
          break;
        default:
          throw new Error("Can't find slug catogory");
      }

      const [countFilm, listFilm] = await Promise.all([
        FimlsModel.find(options).count(),
        FimlsModel.find(options)
          .skip(skip)
          .limit(filmInPage)
          .sort({ view: -1 }),
      ]);
      res.status(200).json({
        data: listFilm || [],
        totalPage: Math.ceil(countFilm / filmInPage),
        subName,
      });
    } catch (err) {
      console.log(err.message);
    }
  }
  async listFilmSame(req, res) {
    try {
      const { limit, category } = req.body.data;
      const result = await FimlsModel.find({
        category: { $in: category },
      })
        .sort({ view: -1 })
        .limit(limit);
      if (!result) throw new Error("Cant have one film");
      res.status(200).json({ data: result, status: 200, message: "oke" });
    } catch (err) {
      console.log(err.message);
    }
  }
  async updateLike(req, res) {
    const { idFilm } = req.body.data;
    try {
      await FimlsModel.findByIdAndUpdate(
        { _id: idFilm },
        { $inc: { like: 1 } }
      );
    } catch (err) {
      console.log(err.message);
      res.status(404).json({ message: err.message });
    }
  }
  async updateView(req, res) {
    const { idFilm, username } = req.body.data;
    if (username) {
      Bonus.updateExp(username);
    }

    try {
      const resFilm = await FimlsModel.findByIdAndUpdate(
        { _id: idFilm },
        { $inc: { view: 1 } }
      );
      console.log(resFilm.view);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
}
module.exports = new FimlController();
