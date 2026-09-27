import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function FormField({ label, error, icon: Icon, type, ...inputProps }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <label className="block mb-5">
      <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        )}
        <input
          {...inputProps}
          type={resolvedType}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-ink placeholder:text-ink-soft/50
            transition-shadow focus:outline-none focus:ring-4 focus:ring-marigold/20 focus:border-marigold
            ${Icon ? "pl-9" : ""} ${isPassword ? "pr-10" : ""}
            ${error ? "border-error" : "border-rule"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <span className="block mt-1.5 text-sm text-error">{error}</span>}
    </label>
  );
}