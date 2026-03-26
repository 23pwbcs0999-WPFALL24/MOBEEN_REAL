import { Link } from "react-router-dom";
import { formatPrice, resolveImageUrl } from "../utils/helpers";

function PropertyCard({ property }) {
  const image = resolveImageUrl(property?.images?.[0]) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200";
  const displayPrice = formatPrice(property.price);
  const isPlot = property?.type === "plot";

  return (
    <article className="card overflow-hidden">
      <img src={image} alt={property.title} className="h-52 w-full object-cover" />
      <div className="space-y-2 p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-brass">{property.type}</p>
        <h3 className="line-clamp-1 text-xl font-semibold">{property.title}</h3>
        <p className="line-clamp-2 text-sm text-slate">{property.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">{displayPrice || "Price on request"}</p>
          <p className="text-sm text-slate">{property.location}</p>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            to={`/properties/${property._id}`}
            className="inline-block rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
          >
            View Details
          </Link>
          <Link
            to="/contact"
            className="inline-block rounded-full border border-ink px-4 py-2 text-sm font-semibold text-ink"
          >
            {isPlot ? "Book Plot" : "Contact"}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
