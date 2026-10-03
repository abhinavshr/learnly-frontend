import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import FormField from "../components/FormField.jsx";
import { registerUser, clearAuthError } from "../feature/auth/authSlice.js";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, token } = useSelector((state) => state.auth);
  const isLoading = status === "loading";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // Clear any stale error from a previous attempt when the page mounts
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Once registration succeeds, the store has a token — go to the dashboard
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name";
    if (!form.email) next.email = "Enter your email";
    if (form.password.length < 8) next.password = "Use at least 8 characters";
    if (!form.confirmPassword) {
      next.confirmPassword = "Confirm your password";
    } else if (form.password !== form.confirmPassword) {
      next.confirmPassword = "Passwords don't match";
    }
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    dispatch(
      registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password })
    );
  }

  return (
    <AuthLayout
      eyebrow="Free to start"
      headline="Every quiz question comes from a page you actually uploaded."
    >
      <h1 className="font-serif text-3xl font-semibold text-ink mb-1">Create an account</h1>
      <p className="text-ink-soft mb-8">No card required.</p>

      {error && (
        <div className="rounded-lg bg-error/10 border border-error/30 text-error text-sm px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Full name"
          icon={User}
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={fieldErrors.name}
          placeholder="Your full name"
          autoComplete="name"
          disabled={isLoading}
        />
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
          disabled={isLoading}
        />
        <FormField
          label="Confirm password"
          icon={Lock}
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-white
            font-medium py-2.5 mt-2 hover:bg-ink/90 active:scale-[0.99] transition-all
            focus:outline-none focus:ring-4 focus:ring-marigold/30
            disabled:opacity-60 disabled:pointer-events-none"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-xs text-ink-soft mt-4 text-center">
          By continuing, you agree to Learnly's Terms and Privacy Policy.
        </p>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-ink font-medium underline decoration-marigold decoration-2 underline-offset-2">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}