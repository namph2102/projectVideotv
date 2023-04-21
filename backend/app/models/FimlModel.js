const mongoose = require("mongoose");
const Shema = mongoose.Schema;
const FimlModel = new Shema(
  {
    // id: number,
    name: { type: String, required: true },
    slug: { type: String },
    origin_name: { type: String, required: true },
    description: { type: String, required: true },
    thumb_url: { type: String, required: true },
    poster_url: { type: String, required: true },
    category: { type: Array, default: [] },
    // category: [
    //   { type: mongoose.Schema.Types.ObjectId, ref: "categories", default: [] },
    // ],
    kind: { type: String, default: "feature" },
    status: { type: String, default: "completed" },
    view: { type: Number, default: 0 },
    star: { type: Number, default: 0 },
    year: { type: Number, default: 2023 },
    time: { type: String, default: "" },
    like: { type: Number, default: 0 },
    country: { type: mongoose.Schema.Types.ObjectId, ref: "countries" },
    trailer: { type: Boolean, default: false },
    episode_current: { type: Number, default: 0 },
    eposode_total: { type: Number, default: 1 },
    quanlity: { type: String, default: "HD" },
    lang: { type: String, default: "VietSub" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("movies", FimlModel, "Films");
