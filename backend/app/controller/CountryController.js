const ContryModel = require("../models/CountryModel");
const handleSlug = require("slug");

class CountryController {
  init() {}
  async addCountry(country) {
    try {
      if (!country) throw new Error("Country can't not found");
      const slug = handleSlug(country);
      const getCountry = await ContryModel.findOne({ slug });
      if (getCountry) return getCountry._id;
      else {
        const result = await ContryModel.create({ slug, country });
        if (result) return result._id;
      }
      throw new Error("Country can't not found");
    } catch (err) {
      return false;
    }
  }
}
module.exports = new CountryController();
