import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(form);
      navigate(response?.user?.role === "admin" ? "/dashboard" : "/");
    } catch (error) {
      alert(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-luxe">
      <h1 className="text-3xl">Admin Access</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
        <button className="w-full rounded-xl bg-ink py-3 font-semibold text-white">Login</button>
      </form>
    </section>
  );
}

export default Login;
