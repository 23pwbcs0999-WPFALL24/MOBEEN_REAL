import { useState } from "react";
import { resolveImageUrl } from "../utils/helpers";

function ImageSlider({ images = [], fitContain = false }) {
  const [index, setIndex] = useState(0);
  const safeImages = images.length
    ? images.map((image) => resolveImageUrl(image))
    : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200"];

  const previous = () => {
    setIndex((current) => (current === 0 ? safeImages.length - 1 : current - 1));
  };

  const next = () => {
    setIndex((current) => (current === safeImages.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white">
      <img
        src={safeImages[index]}
        alt="Property"
        className={`h-80 w-full sm:h-[32rem] ${fitContain ? "object-contain" : "object-cover"}`}
      />
      <button
        type="button"
        onClick={previous}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 font-bold"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 font-bold"
      >
        ›
      </button>
    </div>
  );
}

export default ImageSlider;
