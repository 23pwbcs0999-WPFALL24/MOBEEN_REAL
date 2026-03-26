import Property from "../models/Property.js";
import User from "../models/User.js";
import { uploadMediaFile } from "../utils/cloudinary.js";

const normalizePropertyType = (value) => {
  const raw = String(value || "house").toLowerCase().trim();
  if (raw === "plots") return "plot";
  if (raw === "apartments") return "apartment";
  if (raw === "houses") return "house";
  return raw;

};

const parseStringArrayInput = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // Ignore JSON parse errors and parse as delimiter-separated values.
    }

    return raw
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export const getProperties = async (req, res, next) => {
  try {
    const { location, area, type, minPrice, maxPrice, bedrooms, search, agent, limit = 12 } = req.query;
    const query = {};

    if (location) query.location = { $regex: location, $options: "i" };
    if (area) query.area = { $regex: area, $options: "i" };
    if (type) query.type = normalizePropertyType(type);
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (agent) query.agent = agent;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    const properties = await Property.find(query)
      .populate("agent", "name email role")
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ count: properties.length, properties });
  } catch (error) {
    next(error);
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate("agent", "name email role");
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ property });
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (req, res, next) => {
  try {
    const imagePaths = await Promise.all(
      (req.files?.images || []).map((file) =>
        uploadMediaFile(file, { folder: "real-estate/properties/images", resourceType: "image" })
      )
    );
    const uploadedVideoPath = req.files?.video?.[0]
      ? await uploadMediaFile(req.files.video[0], {
          folder: "real-estate/properties/videos",
          resourceType: "video"
        })
      : "";
    const uploadedBrochurePath = req.files?.brochure?.[0]
      ? await uploadMediaFile(req.files.brochure[0], {
          folder: "real-estate/properties/docs",
          resourceType: "raw"
        })
      : "";

    const property = await Property.create({
      ...req.body,
      type: normalizePropertyType(req.body.type),
      bedrooms: Number(req.body.bedrooms || 0),
      bathrooms: Number(req.body.bathrooms || 0),
      price: Number(req.body.price || 0),
      images: imagePaths,
      videoUrl: uploadedVideoPath || String(req.body.videoUrl || "").trim(),
      brochureUrl: uploadedBrochurePath || String(req.body.brochureUrl || "").trim(),
      agent: req.user._id
    });

    res.status(201).json({ property });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const canEdit =
      property.agent.toString() === req.user._id.toString() || req.user.role === "admin";

    if (!canEdit) {
      return res.status(403).json({ message: "Not allowed to update this property" });
    }

    const updates = { ...req.body };
    const uploadedImagePaths = await Promise.all(
      (req.files?.images || []).map((file) =>
        uploadMediaFile(file, {
          folder: "real-estate/properties/images",
          resourceType: "image"
        })
      )
    );
    const uploadedVideoPath = req.files?.video?.[0]
      ? await uploadMediaFile(req.files.video[0], {
          folder: "real-estate/properties/videos",
          resourceType: "video"
        })
      : "";
    const uploadedBrochurePath = req.files?.brochure?.[0]
      ? await uploadMediaFile(req.files.brochure[0], {
          folder: "real-estate/properties/docs",
          resourceType: "raw"
        })
      : "";
    const removeImages = parseStringArrayInput(req.body.removeImages);
    const imageUrls = parseStringArrayInput(req.body.imageUrls);

    if (removeImages.length || imageUrls.length || uploadedImagePaths.length) {
      const baseImages = (property.images || []).filter((image) => !removeImages.includes(image));
      updates.images = [...baseImages, ...imageUrls, ...uploadedImagePaths];
    }

    if (uploadedVideoPath) {
      updates.videoUrl = uploadedVideoPath;
    }
    if (uploadedBrochurePath) {
      updates.brochureUrl = uploadedBrochurePath;
    }

    if (updates.type !== undefined) {
      updates.type = normalizePropertyType(updates.type);
    }
    if (updates.price !== undefined) {
      updates.price = Number(updates.price || 0);
    }
    if (updates.bedrooms !== undefined) {
      updates.bedrooms = Number(updates.bedrooms || 0);
    }
    if (updates.bathrooms !== undefined) {
      updates.bathrooms = Number(updates.bathrooms || 0);
    }

    Object.assign(property, updates);
    await property.save();

    res.json({ property });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const canDelete =
      property.agent.toString() === req.user._id.toString() || req.user.role === "admin";

    if (!canDelete) {
      return res.status(403).json({ message: "Not allowed to delete this property" });
    }

    await property.deleteOne();
    res.json({ message: "Property deleted" });
  } catch (error) {
    next(error);
  }
};

export const toggleFavoriteProperty = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const exists = user.favorites.some((id) => id.toString() === req.params.id);
    if (exists) {
      user.favorites = user.favorites.filter((id) => id.toString() !== req.params.id);
    } else {
      user.favorites.push(req.params.id);
    }

    await user.save();

    res.json({ message: exists ? "Removed from favorites" : "Added to favorites", favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};
