const UserModel = require("../models/UserModel");
const ExpLevel = require("../models/ExpLvModel");
const fs = require("fs");

class UserUpdate {
  async updateExp(username, point) {
    try {
      if (!point) {
        point = Math.ceil(Math.random() * 20);
      }
      if (username) {
        const user = await UserModel.findOneAndUpdate(
          { username },
          { $inc: { expLv: point } }
        );
        const levelNext = await ExpLevel.find({
          musty: { $lt: user.expLv + point },
        });
        const item = (levelNext && levelNext.at(-1)) || "";
        if (item && user.expLv + point >= item.musty) {
          await UserModel.findOneAndUpdate(
            { username },
            { nameLevel: item._id }
          );
        }
        console.log(user.nameLevel);
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  async removeImage(link) {
    try {
      if (!link) throw new Error("Thiếu đường link tuyệt đối");
      const fiexedLink = link.replace(process.env.DOMAIN, "");
      if (!fs.existsSync(fiexedLink)) {
        throw new Error("file dont have directoty");
      }
      console.log("Cover path link to remove image", fiexedLink);
      fs.unlink(fiexedLink, (err) => {
        if (err) throw new Error(err);
        console.log("file  đã bị xóa");
      });
    } catch (err) {
      console.log(err.message);
    }
  }
}
module.exports = new UserUpdate();
