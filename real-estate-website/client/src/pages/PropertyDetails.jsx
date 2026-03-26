import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import AgentCard from "../components/AgentCard";
import { fetchPropertyById, toggleFavorite } from "../services/propertyService";
import { formatPrice, resolveImageUrl, resolveMapEmbedUrl } from "../utils/helpers";

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const response = await fetchPropertyById(id);
        setProperty(response.property);
      } catch (error) {
        setProperty(null);
      }
    };

    loadProperty();
  }, [id]);

  const onFavorite = async () => {
    try {
      await toggleFavorite(id);
      alert("Favorite updated");
    } catch (error) {
      alert("Please login to save favorites");
    }
  };

  if (!property) {
    return <p>Property not found.</p>;
  }

  const displayPrice = formatPrice(property.price);
  const isPlot = property.type === "plot";
  const mapEmbedUrl = resolveMapEmbedUrl(property.mapUrl, property.location);
  const videoUrl = resolveImageUrl(property.videoUrl);
  const brochureUrl = resolveImageUrl(property.brochureUrl);
  const galleryImages = (property.images || []).map((image) => resolveImageUrl(image));

  return (
    <section className="space-y-6">
      <ImageSlider images={property.images} fitContain={isPlot} />
      {galleryImages.length > 1 && (
        <div className="card p-4">
          <h3 className="text-xl font-semibold">Image Gallery</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((image, idx) => (
              <img
                key={`${image}-${idx}`}
                src={image}
                alt={`Property view ${idx + 1}`}
                className="h-40 w-full rounded-xl border border-mist object-cover"
              />
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        <article className="card p-6 lg:col-span-2">
          <p className="text-sm uppercase tracking-widest text-brass">{property.type}</p>
          <h1 className="mt-2 text-4xl">{property.title}</h1>
          <p className="mt-3 text-2xl font-bold">{displayPrice || "Price on request"}</p>
          <p className="mt-4 leading-relaxed text-slate">{property.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <p><strong>Location:</strong> {property.location}</p>
            <p><strong>Area:</strong> {property.area || "N/A"}</p>
            {!isPlot && <p><strong>Bedrooms:</strong> {property.bedrooms}</p>}
            {!isPlot && <p><strong>Bathrooms:</strong> {property.bathrooms}</p>}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={onFavorite} className="rounded-full bg-ink px-5 py-2 font-semibold text-white">
              Save Property
            </button>
            <Link to="/contact" className="rounded-full border border-ink px-5 py-2 font-semibold text-ink">
              {isPlot ? "Book This Plot" : "Contact Agent"}
            </Link>
          </div>

          {(videoUrl || brochureUrl) && (
            <div className="mt-8 space-y-4 rounded-2xl border border-mist p-4">
              <h3 className="text-xl font-semibold">Property Media</h3>

              {videoUrl && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate">Video Tour</p>
                  <video src={videoUrl} controls className="max-h-[24rem] w-full rounded-xl border border-mist bg-black" />
                </div>
              )}

              {brochureUrl && (
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-semibold text-slate">Brochure PDF</p>
                  <a
                    href={brochureUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-ink px-4 py-2 text-sm font-semibold text-ink"
                  >
                    Download Brochure
                  </a>
                </div>
              )}
            </div>
          )}
        </article>

        <div className="space-y-4">
          <AgentCard agent={property.agent || { name: "Agent", email: "agent@email.com", role: "agent" }} />
          <div className="card p-4">
            <h4 className="text-lg font-semibold">Location Map</h4>
            {mapEmbedUrl ? (
              <iframe
                src={mapEmbedUrl}
                title="Property location map"
                className="mt-3 h-56 w-full rounded-xl border border-mist"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <p className="mt-2 text-sm text-slate">Map link not added yet for this property.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PropertyDetails;
