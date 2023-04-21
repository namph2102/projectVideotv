const UserModel = require("../models/UserModel");
const TopUpModel = require("../models/TopupModel");
const expVipModel = require("../models/ExpVipModel");
const UserUtil = require("../utils/UserUtil");
class TopUpController {
  static async updateVip(idUser, expBonus) {
    try {
      const account = await UserModel.findOneAndUpdate(
        { _id: idUser },
        { $inc: { expVip: expBonus, coin: expBonus } }
      ).select("");

      const levelNext = await expVipModel.find({
        musty: { $lt: account.coin + expBonus },
      });
      const item = (levelNext && levelNext.at(-1)) || "";

      if (item && account.coin + expBonus >= item.musty) {
        if (account.permission !== "admin") {
          await UserModel.findOneAndUpdate(
            { _id: idUser },
            { vip: item.level, permission: "vip" }
          );
        } else {
          await UserModel.findOneAndUpdate(
            { _id: idUser },
            { vip: item.level }
          );
        }
      }
    } catch (err) {
      console.lof(err.message);
    }
  }
  async TopUp(req, res) {
    console.log("Gửi request nạp thẻ");
    try {
      console.log(req.body.data);
      const {
        username,
        idUser,
        status,
        payCode,
        money,
        seri = "",
        nameBank = "",
        nameWallet = "",
      } = req.body.data;
      const newTopup = money
        ? await TopUpModel.create({
            account: idUser,
            status,
            payCode,
            money,
            seri,
            nameBank,
            nameWallet,
          })
        : "";
      if (!newTopup) throw new Error("Nạp thất bại");
      if (status == 2) {
        // nạp paypal thành công
        const expBonus = Math.floor(money / 100);
        await TopUpController.updateVip(idUser, expBonus);
        await UserUtil.updateExp(username, expBonus);
      }
      const account = await UserModel.findById({ _id: idUser }).select(
        "coin vip expLv expVip permission"
      );
      res
        .status(201)
        .json({ message: "Hệ thống đang xử lý!", status: 200, account });
    } catch (err) {
      console.log(err.message);
    }
  }
  async getHistoryToUser(req, res) {
    try {
      const { idUser } = req.body.data;
      if (!idUser) throw new Error("Iduser not found");
      const history = await TopUpModel.find({ account: idUser }).sort({
        createdAt: -1,
      });
      if (history) {
        res.status(200).json({ message: "oke", status: 200, history });
      } else {
        throw new Error("Không tồn tại history");
      }
    } catch (err) {
      console.log(err.message);
    }
  }
}
module.exports = new TopUpController();
