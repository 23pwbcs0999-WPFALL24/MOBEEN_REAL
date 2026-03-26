import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import Filter from "../components/Filter";
import { fetchProperties } from "../services/propertyService";

function Properties() {
  const locationState = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialSearch = new URLSearchParams(locationState.search).get("search") || "";
  const [filters, setFilters] = useState({
    search: initialSearch,
    location: "",
    area: "",
    type: "",
    minPrice: "",
    maxPrice: ""
  });

  useEffect(() => {
    const keyword = new URLSearchParams(locationState.search).get("search") || "";
    setFilters((previous) => ({ ...previous, search: keyword }));
  }, [locationState.search]);

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        const response = await fetchProperties(filters);
        setProperties(response.properties || []);
      } catch (error) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [filters]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl">Properties</h1>
        <p className="mt-2 text-slate">Filter listings by location, area, type, and budget.</p>
      </div>

      <Filter filters={filters} onChange={setFilters} />

      {loading ? <p>Loading properties...</p> : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </section>
  );
}

export default Properties;
