const multer = require("multer");

const storage = multer.memoryStorage();

const filter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter: filter,
});

module.exports = upload;
