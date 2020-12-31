"use strict";

var multer = require("multer");

var storage = multer.diskStorage({
  destination: destination
}); //Куда и как сохраняем данные

var fileFilter = function fileFilter(req, file, callBack) {};

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter
});