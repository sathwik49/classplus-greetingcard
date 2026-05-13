import multer from "multer";
import { AppError } from "../utils/error";

const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Only PNG, JPG, and JPEG images are allowed"));
    }
  },
});

export default upload;
