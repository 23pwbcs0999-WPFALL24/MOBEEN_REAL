import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { createProperty } from "../services/propertyService";
import { useAuth } from "../context/AuthContext";

const initialState = {
  title: "",
  description: "",
  price: "",
  location: "",
  mapUrl: "",
  area: "",
  bedrooms: "",
  bathrooms: "",
  type: "house",
  videoUrl: "",
  brochureUrl: ""
};

function AddProperty() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState(initialState);
  const [images, setImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [brochureFile, setBrochureFile] = useState(null);
  const isAdmin = user?.role === "admin";
  const labels = {
    mapUrl: "Google Maps Embed URL",
    videoUrl: "Video URL (optional)",
    brochureUrl: "PDF URL (optional)"
  };

  const onChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!isAdmin) {
      alert("Only Mobeen can add properties.");
      return;
    }

    const body = new FormData();

    Object.entries(form).forEach(([key, value]) => body.append(key, value));
    Array.from(images).forEach((file) => body.append("images", file));
    if (videoFile) body.append("video", videoFile);
    if (brochureFile) body.append("brochure", brochureFile);

    try {
      await createProperty(body);
      alert("Property added successfully");
      setForm(initialState);
      setImages([]);
      setVideoFile(null);
      setBrochureFile(null);
      event.target.reset();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to add property");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/mobeen-access" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-4xl">Add Property</h1>
        <Link to="/dashboard" className="rounded-full border border-ink px-4 py-2 text-sm font-semibold">
          Back to Admin
        </Link>
      </div>
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-3xl bg-white p-6 shadow-luxe">
        {Object.keys(initialState).map((field) => (
          <div key={field}>
            <label className="mb-1 block text-sm font-semibold capitalize">{labels[field] || field}</label>
            {field === "description" ? (
              <textarea
                name={field}
                value={form[field]}
                onChange={onChange}
                className="w-full rounded-xl border border-mist px-3 py-2"
              />
            ) : field === "type" ? (
              <select
                name={field}
                value={form[field]}
                onChange={onChange}
                className="w-full rounded-xl border border-mist px-3 py-2"
              >
                <option value="house">House</option>
                <option value="plot">Plot</option>
                <option value="apartment">Apartment</option>
              </select>
            ) : (
              <>
                <input
                  name={field}
                  value={form[field]}
                  onChange={onChange}
                  className="w-full rounded-xl border border-mist px-3 py-2"
                />
                {field === "mapUrl" && (
                  <p className="mt-1 text-xs text-slate">
                    Paste Google Maps share link or embed URL. The system auto-converts for map display.
                  </p>
                )}
              </>
            )}
          </div>
        ))}
        <div>
          <label className="mb-1 block text-sm font-semibold">Images</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />
          <p className="mt-1 text-xs text-slate">You can upload multiple property images.</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Video File (optional)</label>
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
          <p className="mt-1 text-xs text-slate">Upload one walkthrough video or add a video URL above.</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Brochure PDF (optional)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setBrochureFile(e.target.files?.[0] || null)}
          />
          <p className="mt-1 text-xs text-slate">Upload one brochure PDF or provide a PDF URL above.</p>
        </div>
        <button className="rounded-full bg-ink px-6 py-3 font-semibold text-white">Publish Property</button>
      </form>
    </section>
  );
}

export default AddProperty;
