import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import FormField from "../components/FormField.jsx";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [remember, setRemember] = useState(true);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // No backend call yet — placeholder validation only.
    const next = {};
    if (!form.email) next.email = "Enter your email";
    if (!form.password) next.password = "Enter your password";
    setErrors(next);
  }

  return (
    <AuthLayout headline="Turn any PDF into a tutor that already read it.">
      <h1 className="font-serif text-3xl font-semibold text-ink mb-1">Sign in</h1>
      <p className="text-ink-soft mb-8">Pick up where you left off.</p>

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Email"
          icon={Mail}
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <FormField
          label="Password"
          icon={Lock}
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between mb-6 -mt-1">
          <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-rule text-marigold focus:ring-marigold/40 accent-[#E8A33D]"
            />
            Remember me
          </label>
          <a href="#" className="text-sm text-ink-soft hover:text-ink transition-colors">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-ink text-white font-medium py-2.5
            hover:bg-ink/90 active:scale-[0.99] transition-all
            focus:outline-none focus:ring-4 focus:ring-marigold/30"
        >
          Sign in
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        New here?{" "}
        <Link to="/register" className="text-ink font-medium underline decoration-marigold decoration-2 underline-offset-2">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}