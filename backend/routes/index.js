const FilmRouter = require("./FimlRouter");
const CommemtRouter = require("./CommemtRouter");
const UserRouter = require("./UserRouter");
const IconRouter = require("./IconRouter");
const StarRouter = require("./StarRouter");
const FilmDetailRouter = require("./FilmDetailRouter");
const BookmarkRouter = require("./BookmarkRouter");
const ExpRotuer = require("./expRouter");
const TopUpRouter = require("./TopUpRouter");

function AllRouter(app) {
  app.use("/api", FilmRouter);
  app.use("/comments", CommemtRouter);
  app.use("/user", UserRouter);
  app.use("/icon", IconRouter);
  app.use("/star", StarRouter);
  app.use("/filmdetail", FilmDetailRouter);
  app.use("/bookmark", BookmarkRouter);
  app.use("/exp", ExpRotuer);
  app.use("/topup", TopUpRouter);
}
module.exports = AllRouter;
