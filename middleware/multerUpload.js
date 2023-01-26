const multer = require("multer");
const path = require("path");

const fileSize = 1000000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${req.body.productCode}|${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize,
    file: 1,
  },
  fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) return cb(null, true);

    cb(null, false);
    req.fileUploadError = { msg: "upload only jpeg|jpg|png|gif" };
  },
}).single("product_thumbnail");

module.exports = upload;
