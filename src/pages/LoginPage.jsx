import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import FormField from "../components/FormField.jsx";
import { loginUser, clearAuthError } from "../features/auth/authSlice.js";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, token } = useSelector((state) => state.auth);
  const isLoading = status === "loading";

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!form.email) next.email = "Enter your email";
    if (!form.password) next.password = "Enter your password";
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    dispatch(loginUser({ email: form.email.trim(), password: form.password }));
  }

  return (
    <AuthLayout headline="Turn any PDF into a tutor that already read it.">
      <h1 className="font-serif text-3xl font-semibold text-ink mb-1">Sign in</h1>
      <p className="text-ink-soft mb-8">Pick up where you left off.</p>

      {error && (
        <div className="rounded-lg bg-error/10 border border-error/30 text-error text-sm px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Email"
          icon={Mail}
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
        />
        <FormField
          label="Password"
          icon={Lock}
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between mb-6 -mt-1">
          <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-rule accent-[#E8A33D]"
              disabled={isLoading}
            />
            Remember me
          </label>
          <a href="#" className="text-sm text-ink-soft hover:text-ink transition-colors">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-white
            font-medium py-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all
            focus:outline-none focus:ring-4 focus:ring-marigold/30
            disabled:opacity-60 disabled:pointer-events-none"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Signing in..." : "Sign in"}
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