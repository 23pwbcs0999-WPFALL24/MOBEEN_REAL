import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    const keyword = value.trim();
    onSearch?.(keyword);
    navigate(keyword ? `/properties?search=${encodeURIComponent(keyword)}` : "/properties");
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl bg-white/90 p-4 shadow-luxe sm:flex-row">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search by city, area, or property title"
        className="w-full rounded-xl border border-mist px-4 py-3 text-ink placeholder:text-slate outline-none focus:border-ink"
      />
      <button type="submit" className="rounded-xl bg-ink px-6 py-3 font-semibold text-white hover:bg-slate">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
