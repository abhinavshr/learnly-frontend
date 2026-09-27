import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import FormField from "../components/FormField.jsx";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name";
    if (!form.email) next.email = "Enter your email";
    if (form.password.length < 8) next.password = "Use at least 8 characters";
    if (!form.confirmPassword) {
      next.confirmPassword = "Confirm your password";
    } else if (form.password !== form.confirmPassword) {
      next.confirmPassword = "Passwords don't match";
    }
    setErrors(next);
  }

  return (
    <AuthLayout
      eyebrow="Free to start"
      headline="Every quiz question comes from a page you actually uploaded."
    >
      <h1 className="font-serif text-3xl font-semibold text-ink mb-1">Create an account</h1>
      <p className="text-ink-soft mb-8">No card required.</p>

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Full name"
          icon={User}
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Your full name"
          autoComplete="name"
        />
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
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
        <FormField
          label="Confirm password"
          icon={Lock}
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-ink text-white font-medium py-2.5 mt-2
            hover:bg-ink/90 active:scale-[0.99] transition-all
            focus:outline-none focus:ring-4 focus:ring-marigold/30"
        >
          Create account
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