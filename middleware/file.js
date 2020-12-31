const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cd(null, "images");
  }, //куда складываем данный файл
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + `-` + file.originalname);
  }, //как назвать новый файл (кот-й загрузили)
}); //Куда и как сохраняем данные

const allowedTypes = ["images/png", "images/jpg", "images/jpeg"];

const fileFilter = (req, file, callBack) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}; //валидатор для файлов (ограничения)

module.exports = multer({
  storage,
  fileFilter,
});
