import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createProperty,
  deleteProperty,
  getProperties,
  getPropertyById,
  toggleFavoriteProperty,
  updateProperty
} from "../controllers/propertyController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = Router();

const uploadRoot = process.env.VERCEL ? "/tmp/uploads" : path.join(process.cwd(), "uploads");

const uploadPaths = {
  images: path.join(uploadRoot, "propertyImages"),
  video: path.join(uploadRoot, "propertyVideos"),
  brochure: path.join(uploadRoot, "propertyDocs")
};

Object.values(uploadPaths).forEach((dir) => {
  fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (file.fieldname === "video") {
      return callback(null, uploadPaths.video);
    }

    if (file.fieldname === "brochure") {
      return callback(null, uploadPaths.brochure);
    }

    return callback(null, uploadPaths.images);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname);
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  }
});

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

const upload = multer({ storage, fileFilter });

router.get("/", getProperties);
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
