const express = require("express");
const router = express.Router();
const AdminController = require("../app/controller/AdminController");

const {
  AuthorizationAdmin,
  AuthenzationAdmin,
} = require("../app/Authorization");
const multer = require("multer");
const uniqid = require("uniqid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file) {
      cb(null, path.join("public", "uploads"));
    }
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(
        null,
        uniqid.time() +
          Math.floor(Math.random() * 5555) +
          path.extname(file.originalname)
      );
    }
  },
});

const upload = multer({ storage: storage });
router
  .get("/", AuthorizationAdmin, AdminController.init)
  .get("/user/admin/login", AdminController.login)
  .get("/catelog", AdminController.PageCateLog)
  .get("/catelog/additem", AdminController.showAdd)
  .post(
    "/catelog/additem",
    AuthenzationAdmin,
    upload.array("uploadfile"),
    AdminController.AddFiml
  )
  .post("/category/delete", AuthenzationAdmin, AdminController.deleteCategory);
router.post("/checkaccount", AdminController.checkAccount);

router
  .get("/user", AdminController.showUser)
  .get("/user/edituser/:id", AdminController.showUserEdit)
  .post(
    "/user/edituser/:id",
    AuthenzationAdmin,
    upload.single("uploadavata"),
    AdminController.showUserEdit
  )
  .post("/user/deleteicon", AuthenzationAdmin, AdminController.deleteIcon)
  .post(
    "/user/admin/changePassword",
    AuthenzationAdmin,
    AdminController.changePassword
  );

router
  .get("/login", (req, res) => {
    res.render("login", { layout: false });
  })
  //Page not found 404
  .get("/*", (req, res) => {
    res.render("pagenotfound", { layout: false });
  });
module.exports = router;
