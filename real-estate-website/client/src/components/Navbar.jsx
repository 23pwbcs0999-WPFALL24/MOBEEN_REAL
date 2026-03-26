import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/contact", label: "Contact" }
];

function Navbar() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/mobeen.jpg" alt="Mobeen Real Estate Consultant logo" className="h-12 w-12 rounded-full object-cover" />
          <div>
            <p className="text-xl font-bold leading-tight tracking-tight text-ink">MOBEEN</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Real Estate Consultant</p>
          </div>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-ink text-white" : "text-slate hover:bg-accent-soft"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-ink text-white" : "text-slate hover:bg-accent-soft"
                }`
              }
            >
              Dashboard
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
