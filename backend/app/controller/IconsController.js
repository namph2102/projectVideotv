const IconModel = require("../models/IconModel");
const UserModal = require("../models/UserModel");
class IconTroller {
  async init(req, res) {
    try {
      const { title, link } = req.body.data;
      const checkIconExtended = await IconModel.findOne({ title });
      if (checkIconExtended) throw new Error("Icon tồn tại");
      const data = await IconModel.create({ title, link });

      if (data) {
        res.json({ message: "Thêm thành công!", data, status: 200 });
      } else res.json({ message: "Thiếu một số body data!", status: 202 });
    } catch (err) {
      res.sendStatus(403).json({ message: err.message, status: 403 });
    }
  }
  async addIconToUser(req, res) {
    try {
      const { idIcon, idUser } = req.body.data;

      const account = await UserModal.findById({
        _id: idUser,
      });
      if (!account) throw new Error("Tài khoản không  tồn tại");
      const checkIcon = account.icons.find((item) => item._id == idIcon);
      if (checkIcon) throw new Error("icon tồn tại");
      const result = await IconModel.findOne({ _id: idIcon });
      if (result) {
        const user = await UserModal.findByIdAndUpdate(
          { _id: idUser },
          { $push: { icons: idIcon } }
        );
        if (user) {
          res.status(200).json({ message: "upload thành công", status: 200 });
        } else {
          throw new Error("Không thêm thành công");
        }
      }
    } catch (err) {
      res.status(404).json({ message: err.message, status: 404 });
    }
  }
}
module.exports = new IconTroller();
