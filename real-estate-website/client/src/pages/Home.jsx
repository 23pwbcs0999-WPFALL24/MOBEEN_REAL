import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";
import { fetchProperties } from "../services/propertyService";
import { formatPrice, resolveImageUrl } from "../utils/helpers";

function Home() {
  const [featured, setFeatured] = useState([]);
  const [query, setQuery] = useState("");
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const response = await fetchProperties({ limit: 6, search: query });
        setFeatured(response.properties || []);
      } catch (error) {
        setFeatured([]);
      }
    };

    loadFeatured();
  }, [query]);

  useEffect(() => {
    if (!featured.length) {
      setFeaturedIndex(0);
      return;
    }

    setFeaturedIndex((prev) => (prev >= featured.length ? 0 : prev));
  }, [featured]);

  useEffect(() => {
    if (isPaused || featured.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setFeaturedIndex((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => window.clearInterval(timer);
  }, [featured.length, isPaused]);

  const previousFeatured = () => {
    if (!featured.length) return;
    setFeaturedIndex((prev) => (prev === 0 ? featured.length - 1 : prev - 1));
  };

  const nextFeatured = () => {
    if (!featured.length) return;
    setFeaturedIndex((prev) => (prev === featured.length - 1 ? 0 : prev + 1));
  };

  const currentFeatured = featured[featuredIndex] || null;
  const currentImage = resolveImageUrl(currentFeatured?.images?.[0]) || "/images/samarbagh.jpg";
  const currentPrice = formatPrice(currentFeatured?.price);
  const currentType = currentFeatured?.type || "featured";

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-ink via-slate to-ink p-8 text-white sm:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-brass">Mobeen Real Estate Consultant</p>
        <h1 className="mt-3 max-w-2xl text-4xl sm:text-5xl">Find the right property with confidence and clarity.</h1>
        <p className="mt-4 max-w-2xl text-white/80">
          Buy/Sell Residential Plots, Houses, Apartments and Shops with trusted guidance from Mobeen.
        </p>
        <div className="mt-8 max-w-3xl">
          <SearchBar onSearch={setQuery} />
        </div>
      </section>

      <section
        className="relative rounded-3xl bg-white p-5 shadow-luxe sm:p-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute right-5 top-5 z-10 flex gap-2 sm:right-6 sm:top-6">
          <button
            type="button"
            onClick={previousFeatured}
            className="rounded-full border border-mist bg-white px-3 py-1.5 text-lg font-bold text-ink"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={nextFeatured}
            className="rounded-full border border-mist bg-white px-3 py-1.5 text-lg font-bold text-ink"
          >
            ›
          </button>
        </div>

        <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div className="group relative overflow-hidden rounded-2xl border border-mist bg-white">
            <img
              src={currentImage}
              alt={currentFeatured?.title || "Featured property"}
              className="h-64 w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 sm:h-72"
            />
            <span className="absolute bottom-3 right-3 rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              {featured.length ? `${featuredIndex + 1}/${featured.length}` : "1/1"}
            </span>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brass">Current Project</p>
            <h2 className="text-2xl text-ink sm:text-3xl">
              {currentFeatured?.title || "Samar Bagh Enclave, Northern Bypass Peshawar"}
            </h2>
            <p className="text-sm leading-relaxed text-slate sm:text-base">
              {currentFeatured?.description || "Samar Bagh - booking options for 5, 7, and 10 Marla residential plots."}
            </p>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate">
              {currentType} {currentPrice ? `| ${currentPrice}` : "| Price on request"}
            </p>
            <Link
              to={currentFeatured?._id ? `/properties/${currentFeatured._id}` : "/properties"}
              className="inline-block rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate"
            >
              Details
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-3xl">Featured Properties</h2>
          <span className="text-sm font-semibold uppercase tracking-widest text-slate">Updated Daily</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl bg-white p-6 shadow-luxe sm:grid-cols-4">
        {["Hayatabad", "University Town", "Ring Road", "Warsak Road"].map((area) => (
          <article key={area} className="rounded-2xl bg-sand p-4 text-center">
            <p className="text-sm uppercase tracking-widest text-slate">Top Area</p>
            <h3 className="mt-2 text-xl">{area}</h3>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Home;
