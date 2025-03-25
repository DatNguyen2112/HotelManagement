const express = require("express");
const configViewEngine = app => {
  app.use(express.static("./src/public"));
};
module.exports = configViewEngine;