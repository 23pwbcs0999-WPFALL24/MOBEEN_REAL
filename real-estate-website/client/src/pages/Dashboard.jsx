import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deleteProperty, fetchProperties, updateProperty } from "../services/propertyService";
import { formatPrice, resolveImageUrl } from "../utils/helpers";

function Dashboard() {
  const { user, logout, loading } = useAuth();
  const [properties, setProperties] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    location: "",
    mapUrl: "",
    videoUrl: "",
    brochureUrl: "",
    imageUrls: "",
    type: "house",
    price: "",
    bedrooms: "",
    bathrooms: ""
  });
  const [newImages, setNewImages] = useState([]);
  const [newVideo, setNewVideo] = useState(null);
  const [newBrochure, setNewBrochure] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const isAdmin = user?.role === "admin";

  const loadProperties = async () => {
    setListLoading(true);
    try {
      const response = await fetchProperties({ agent: user?._id });
      setProperties(response.properties || []);
    } catch (error) {
      setProperties([]);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id && isAdmin) {
      loadProperties();
    }
  }, [user?._id, isAdmin]);

  const remove = async (id) => {
    try {
      const confirmed = window.confirm("Delete this property?");
      if (!confirmed) return;
      await deleteProperty(id);
      loadProperties();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const startEdit = (property) => {
    setEditingId(property._id);
    setForm({
      title: property.title || "",
      location: property.location || "",
      mapUrl: property.mapUrl || "",
      videoUrl: property.videoUrl || "",
      brochureUrl: property.brochureUrl || "",
      imageUrls: "",
      type: property.type || "house",
      price: String(property.price ?? ""),
      bedrooms: String(property.bedrooms ?? ""),
      bathrooms: String(property.bathrooms ?? "")
    });
    setExistingImages(property.images || []);
    setRemovedImages([]);
    setNewImages([]);
    setNewVideo(null);
    setNewBrochure(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setExistingImages([]);
    setRemovedImages([]);
    setNewImages([]);
    setNewVideo(null);
    setNewBrochure(null);
  };

  const toggleRemoveExistingImage = (image) => {
    setRemovedImages((previous) =>
      previous.includes(image) ? previous.filter((entry) => entry !== image) : [...previous, image]
    );
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      setSaving(true);
      const isPlotType = form.type === "plot";
      const body = new FormData();
      body.append("title", form.title);
      body.append("location", form.location);
      body.append("mapUrl", form.mapUrl);
      body.append("type", form.type);
      body.append("price", String(Number(form.price || 0)));
      body.append("bedrooms", String(isPlotType ? 0 : Number(form.bedrooms || 0)));
      body.append("bathrooms", String(isPlotType ? 0 : Number(form.bathrooms || 0)));
      body.append("videoUrl", form.videoUrl);
      body.append("brochureUrl", form.brochureUrl);
      body.append("imageUrls", form.imageUrls);
      body.append("removeImages", JSON.stringify(removedImages));
      Array.from(newImages).forEach((file) => body.append("images", file));
      if (newVideo) body.append("video", newVideo);
      if (newBrochure) body.append("brochure", newBrochure);

      await updateProperty(editingId, body);
      setEditingId(null);
      setExistingImages([]);
      setRemovedImages([]);
      setNewImages([]);
      setNewVideo(null);
      setNewBrochure(null);
      await loadProperties();
    } catch (error) {
      alert(error?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const text = `${property.title || ""} ${property.location || ""}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

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
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-luxe">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">Admin Panel</p>
            <h1 className="mt-2 text-3xl sm:text-4xl">Website Manager</h1>
            <p className="mt-2 text-slate">Only tools you need: add, edit, delete properties.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/add-property" className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white">
              Add New Property
            </Link>
            <button onClick={logout} className="rounded-full border border-ink px-5 py-2 text-sm font-semibold">
              Logout
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or location"
            className="w-full max-w-md rounded-xl border border-mist px-3 py-2"
          />
          <button onClick={loadProperties} className="rounded-full border border-ink px-4 py-2 text-sm font-semibold">
            Refresh
          </button>
          <span className="text-sm text-slate">Total: {properties.length}</span>
        </div>
      </div>

      <div className="space-y-3">
        {listLoading && <p className="text-sm text-slate">Loading properties...</p>}

        {!listLoading && filteredProperties.length === 0 && (
          <div className="rounded-2xl border border-mist bg-white p-5">
            <p className="text-slate">No properties found.</p>
          </div>
        )}

        {filteredProperties.map((property) => {
          const displayPrice = formatPrice(property.price);
          const visibleExistingImages = existingImages.filter((image) => !removedImages.includes(image));

          return (
          <article key={property._id} className="rounded-2xl border border-mist bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <img
                  src={resolveImageUrl(property.images?.[0]) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200"}
                  alt={property.title}
                  className="h-16 w-24 rounded-lg border border-mist object-cover"
                />
                <div className="min-w-0">
                <h3 className="break-words text-lg font-semibold text-ink">{property.title}</h3>
                <p className="break-words text-sm text-slate">{property.location}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{displayPrice || "Price on request"}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => startEdit(property)}
                  className="rounded-full border border-ink px-4 py-2 text-sm font-semibold text-ink"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(property._id)}
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Delete
                </button>
              </div>
            </div>

            {editingId === property._id && (
              <div className="mt-4 grid gap-3 rounded-2xl bg-sand p-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate">Title</label>
                  <input
                    value={form.title}
                    onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                    className="w-full rounded-xl border border-mist px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate">Location</label>
                  <input
                    value={form.location}
                    onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                    className="w-full rounded-xl border border-mist px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate">Google Maps Embed URL</label>
                  <input
                    value={form.mapUrl}
                    onChange={(event) => setForm((prev) => ({ ...prev, mapUrl: event.target.value }))}
                    className="w-full rounded-xl border border-mist px-3 py-2"
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                  <p className="mt-1 text-xs text-slate">Paste Google Maps share link or embed URL. Both are supported.</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate">Video URL</label>
                  <input
                    value={form.videoUrl}
                    onChange={(event) => setForm((prev) => ({ ...prev, videoUrl: event.target.value }))}
                    className="w-full rounded-xl border border-mist px-3 py-2"
                    placeholder="https://... or /uploads/propertyVideos/..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate">Brochure PDF URL</label>
                  <input
                    value={form.brochureUrl}
                    onChange={(event) => setForm((prev) => ({ ...prev, brochureUrl: event.target.value }))}
                    className="w-full rounded-xl border border-mist px-3 py-2"
                    placeholder="https://... or /uploads/propertyDocs/..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate">Add Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(event) => setNewImages(event.target.files || [])}
                    className="w-full rounded-xl border border-mist px-3 py-2"
                  />
                  <p className="mt-1 text-xs text-slate">Selected: {newImages?.length || 0} image(s). New images will be added.</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate">Image URLs</label>
                  <textarea
                    value={form.imageUrls}
                    onChange={(event) => setForm((prev) => ({ ...prev, imageUrls: event.target.value }))}
                    className="w-full rounded-xl border border-mist px-3 py-2"
                    placeholder="Paste image URLs separated by comma or new line"
                  />
                  <p className="mt-1 text-xs text-slate">These links are added to gallery along with uploaded images.</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate">Upload Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(event) => setNewVideo(event.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-mist px-3 py-2"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate">Upload Brochure PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => setNewBrochure(event.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-mist px-3 py-2"
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate">Existing Images</label>
                  {existingImages.length === 0 ? (
                    <p className="text-xs text-slate">No existing images.</p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {existingImages.map((image, idx) => {
                        const markedForRemoval = removedImages.includes(image);
                        return (
                          <div key={`${image}-${idx}`} className="rounded-xl border border-mist bg-white p-2">
                            <img
                              src={resolveImageUrl(image)}
                              alt={`Property ${idx + 1}`}
                              className={`h-24 w-full rounded-lg object-cover ${markedForRemoval ? "opacity-40" : ""}`}
                            />
                            <button
                              type="button"
                              onClick={() => toggleRemoveExistingImage(image)}
                              className="mt-2 w-full rounded-full border border-ink px-3 py-1 text-xs font-semibold"
                            >
                              {markedForRemoval ? "Undo Remove" : "Remove"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-slate">Remaining after save: {visibleExistingImages.length}</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate">Type</label>
                  <select
                    value={form.type}
                    onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
                    className="w-full rounded-xl border border-mist px-3 py-2"
                  >
                    <option value="house">House</option>
                    <option value="plot">Plot</option>
                    <option value="apartment">Apartment</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate">Price (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                    className="w-full rounded-xl border border-mist px-3 py-2"
                  />
                  <p className="mt-1 text-xs text-slate">Example: 580000</p>
                </div>
                {form.type !== "plot" && (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate">Bedrooms</label>
                      <input
                        type="number"
                        min="0"
                        value={form.bedrooms}
                        onChange={(event) => setForm((prev) => ({ ...prev, bedrooms: event.target.value }))}
                        className="w-full rounded-xl border border-mist px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate">Bathrooms</label>
                      <input
                        type="number"
                        min="0"
                        value={form.bathrooms}
                        onChange={(event) => setForm((prev) => ({ ...prev, bathrooms: event.target.value }))}
                        className="w-full rounded-xl border border-mist px-3 py-2"
                      />
                    </div>
                  </>
                )}
                <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
                  <button
                    onClick={saveEdit}
                    disabled={saving}
                    className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={cancelEdit} className="rounded-full border border-ink px-4 py-2 text-sm font-semibold">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </article>
          );
        })}
      </div>
    </section>
  );
}

export default Dashboard;
