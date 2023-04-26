const CategoryModel = require("../models/CategoryModel");
const handleSlug = require("slug");
const handleUtils = require("../utils/UserUtil");
class CategoryController {
  async init(req, res) {
    try {
      const listCate = await CategoryModel.find();
      res.status(200).json({ listCate, messageL: "oke", status: 200 });
    } catch (err) {
      res.status(404).json({ status: 404, message: err.message });
      console.log(err.message);
    }
  }
  async addCate(req, res) {
    try {
      let { category } = req.body.data;
      if (category) {
        category = handleUtils.replaceManySpace(category).toLowerCase();
        const slug = handleSlug(category);
        const checked = await CategoryModel.findOne({
          slug,
        });
        if (checked) {
          throw new Error(`Dã tồn tại thể loại ${category}`);
        } else {
          const result = await CategoryModel.create({ slug, category });
          return res
            .status(201)
            .json({ message: "created oke", newCate: result });
        }
      }
      throw new Error(`dữ liệu bị gì ấy`);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
}
module.exports = new CategoryController();
