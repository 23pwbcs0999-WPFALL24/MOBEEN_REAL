import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true, trim: true },
    mapUrl: { type: String, trim: true },
    area: { type: String, required: true },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ["house", "plot", "apartment"],
      default: "house"
    },
    images: [{ type: String }],
    videoUrl: { type: String, trim: true },
    brochureUrl: { type: String, trim: true },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
