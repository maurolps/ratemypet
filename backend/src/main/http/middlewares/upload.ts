import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fieldSize: 256,
  },
  fileFilter: (_req, file, callBack) => {
    if (file.mimetype.startsWith("image/")) {
      callBack(null, true);
    } else {
      callBack(null, false);
    }
  },
});

export const uploadImageMiddleware = upload.single("image");
