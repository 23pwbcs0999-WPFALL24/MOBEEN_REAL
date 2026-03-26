import dotenv from "dotenv";
import mongoose from "mongoose";
import Property from "../models/Property.js";

dotenv.config();

const isLegacyUploadPath = (value) => {
  if (!value || typeof value !== "string") return false;
  const normalized = value.trim().toLowerCase();
  return normalized.startsWith("/uploads/") || normalized.includes("/uploads/");
};

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in server/.env");
  }

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });

  const properties = await Property.find({}, "images videoUrl brochureUrl");

  let scanned = 0;
  let changed = 0;
  let removedImages = 0;
  let clearedVideos = 0;
  let clearedBrochures = 0;

  for (const property of properties) {
    scanned += 1;
    let shouldSave = false;

    const currentImages = Array.isArray(property.images) ? property.images : [];
    const validImages = currentImages.filter((url) => !isLegacyUploadPath(url));
    const removedFromThisProperty = currentImages.length - validImages.length;

    if (removedFromThisProperty > 0) {
      property.images = validImages;
      removedImages += removedFromThisProperty;
      shouldSave = true;
    }

    if (isLegacyUploadPath(property.videoUrl)) {
      property.videoUrl = "";
      clearedVideos += 1;
      shouldSave = true;
    }

    if (isLegacyUploadPath(property.brochureUrl)) {
      property.brochureUrl = "";
      clearedBrochures += 1;
      shouldSave = true;
    }

    if (shouldSave) {
      changed += 1;
      await property.save();
    }
  }

  console.log(JSON.stringify({ scanned, changed, removedImages, clearedVideos, clearedBrochures }, null, 2));
};

run()
  .catch((error) => {
    console.error("Media cleanup failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await mongoose.disconnect();
    } catch {
      // Ignore disconnect errors in cleanup script.
    }
  });
