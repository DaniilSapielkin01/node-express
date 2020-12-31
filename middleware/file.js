const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "images");
  }, //куда складываем данный файл
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname); //как назвать новый файл (кот-й загрузили)
  },
}); //Куда и как сохраняем данные

const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];

const fileFilter = (req, file, cb) => {
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
