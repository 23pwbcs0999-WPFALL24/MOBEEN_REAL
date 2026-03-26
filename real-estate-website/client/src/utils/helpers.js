export const formatPrice = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0
  }).format(numeric);
};

export const resolveImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const apiOrigin = new URL(apiBase).origin;
  return `${apiOrigin}${path.startsWith("/") ? path : `/${path}`}`;
};

export const resolveMapEmbedUrl = (mapUrl, location = "") => {
  const raw = String(mapUrl || "").trim();
  const fallbackLocation = String(location || "").trim();
  const buildEmbedUrl = (value) =>
    `https://www.google.com/maps?q=${encodeURIComponent(value)}&output=embed`;

  if (!raw) {
    return fallbackLocation ? buildEmbedUrl(fallbackLocation) : "";
  }

  if (raw.includes("google.com/maps/embed")) {
    return raw;
  }

  if (raw.includes("maps.app.goo.gl")) {
    // Google short links redirect in browser but are not embeddable in an iframe.
    return fallbackLocation ? buildEmbedUrl(fallbackLocation) : "";
  }

  if (raw.includes("google.com/maps")) {
    try {
      const parsed = new URL(raw);
      const q = parsed.searchParams.get("q");
      if (q) {
        return buildEmbedUrl(q);
      }

      const coords = raw.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
      if (coords) {
        return buildEmbedUrl(`${coords[1]},${coords[2]}`);
      }

      const place = raw.match(/\/place\/([^/?]+)/);
      if (place) {
        const placeText = decodeURIComponent(place[1]).replace(/\+/g, " ");
        return buildEmbedUrl(placeText);
      }
    } catch {
      return buildEmbedUrl(raw);
    }

    return buildEmbedUrl(raw);
  }

  return fallbackLocation ? buildEmbedUrl(fallbackLocation) : raw;
};
