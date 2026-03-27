import { Router } from "express";
import multer from "multer";
import {
  createProperty,
  downloadPropertyBrochure,
  deleteProperty,
  getProperties,
  getPropertyById,
  toggleFavoriteProperty,
  updateProperty
} from "../controllers/propertyController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (file.fieldname === "images") {
    if (file.mimetype.startsWith("image/")) {
      return callback(null, true);
    }
    return callback(new Error("Only image files are allowed in images"));
  }

  if (file.fieldname === "video") {
    if (file.mimetype.startsWith("video/")) {
      return callback(null, true);
    }
    return callback(new Error("Only video files are allowed in video"));
  }

  if (file.fieldname === "brochure") {
    if (file.mimetype === "application/pdf") {
      return callback(null, true);
    }
    return callback(new Error("Only PDF files are allowed in brochure"));
  }

  return callback(new Error("Unsupported upload field"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024
  }
});

router.get("/", getProperties);
router.get("/:id/brochure-download", downloadPropertyBrochure);
router.get("/:id", getPropertyById);
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.fields([
    { name: "images", maxCount: 12 },
    { name: "video", maxCount: 1 },
    { name: "brochure", maxCount: 1 }
  ]),
  createProperty
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.fields([
    { name: "images", maxCount: 12 },
    { name: "video", maxCount: 1 },
    { name: "brochure", maxCount: 1 }
  ]),
  updateProperty
);
router.delete("/:id", protect, authorize("admin"), deleteProperty);
router.post("/:id/favorite", protect, toggleFavoriteProperty);

export default router;
