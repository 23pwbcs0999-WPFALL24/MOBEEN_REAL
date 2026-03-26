import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await register(form);
      navigate(response?.user?.role === "admin" ? "/dashboard" : "/");
    } catch (error) {
      alert(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-luxe">
      <h1 className="text-3xl">Create Account</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(event) => setForm((p) => ({ ...p, name: event.target.value }))}
          className="w-full rounded-xl border border-mist px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm((p) => ({ ...p, email: event.target.value }))}
          className="w-full rounded-xl border border-mist px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm((p) => ({ ...p, password: event.target.value }))}
          className="w-full rounded-xl border border-mist px-3 py-2"
        />
        <button className="w-full rounded-xl bg-ink py-3 font-semibold text-white">Register</button>
      </form>
      <p className="mt-4 text-sm text-slate">
        Already registered? <Link to="/login" className="font-semibold text-ink">Sign in</Link>
      </p>
    </section>
  );
}

export default Register;
