const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const port = 3000;
app.use(
  express.urlencoded({
    type: "application/x-www-form-urlencoded",
    extended: true,
    limit: 1024 * 200,
    parameterLimit: 1024 * 200,
  })
);
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

require("dotenv").config();

const ConnectDB = require("./config");
const casual = require("casual");
const AllRouter = require("./routes");
const jwt = require("jsonwebtoken");

ConnectDB()
  .then(() => {
    console.log("Connection Database Successfully");
  })
  .catch(() => {
    console.log("Cant Connection Database Successfully");
  });
// const books = [
//   {
//     id: 1,
//     title: casual.title,
//   },
//   {
//     id: 2,
//     title: casual.title,
//   },
//   {
//     id: 3,
//     title: casual.title,
//   },
// ];
// function authToken(req, res, next) {
//   const authriaztion = req.headers["authorization"];
//   // Bearer ['token']
//   const token = authriaztion.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SRCRET, (err, data) => {
//     if (err) return res.sendStatus(403);
//     next();
//   });
// }

// app.get("/books", authToken, (req, res) => {
//   res.status(200).json({ sucess: "oke", data: books });
// });

AllRouter(app);

app.listen(port, () => {
  console.log("hoàn thành");
});
