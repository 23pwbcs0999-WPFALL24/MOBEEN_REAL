function Filter({ filters, onChange }) {
  return (
    <div className="grid gap-3 rounded-2xl bg-white p-4 shadow-luxe sm:grid-cols-2 lg:grid-cols-5">
      <input
        placeholder="Location"
        value={filters.location}
        onChange={(e) => onChange({ ...filters, location: e.target.value })}
        className="rounded-xl border border-mist px-3 py-2"
      />
      <input
        placeholder="Area"
        value={filters.area}
        onChange={(e) => onChange({ ...filters, area: e.target.value })}
        className="rounded-xl border border-mist px-3 py-2"
      />
      <select
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
        className="rounded-xl border border-mist px-3 py-2"
      >
        <option value="">Property Type</option>
        <option value="plot">Plot</option>
        <option value="house">House</option>
        <option value="apartment">Apartment</option>
      </select>
      <input
        type="number"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
        className="rounded-xl border border-mist px-3 py-2"
      />
      <input
        type="number"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
        className="rounded-xl border border-mist px-3 py-2"
      />
    </div>
  );
}

export default Filter;
