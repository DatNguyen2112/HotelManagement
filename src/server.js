const express = require("express");
const bodyParser = require("body-parser");
const viewEngine = require("./config/viewEngine");
const initRouter = require("./routers/routers");
const dotenv = require("dotenv");
const connectDB = require("../src/config/connectDB");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

viewEngine(app);
initRouter(app);

connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
