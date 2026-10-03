import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, Target, Calendar, ChevronDown, LogOut, User } from "lucide-react";
import { logout } from "../../features/auth/authSlice.js";

const NAV_LINKS = [
  { to: "/", label: "Documents", icon: BookOpen, end: true },
  { to: "/analytics", label: "Weak topics", icon: Target },
  { to: "/study-plans", label: "Study plans", icon: Calendar },
];

function navLinkClass({ isActive }) {
  return `flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-md transition-colors
    ${isActive ? "text-ink bg-paper" : "text-ink-soft hover:text-ink"}`;
}

function GuestNavbar() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link to="/login" className="font-serif text-xl font-semibold text-ink">
        Learnly
      </Link>
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="text-sm font-medium text-ink-soft hover:text-ink px-3 py-2 transition-colors"
        >
          Sign in
        </Link>
        <Link
          to="/register"
          className="text-sm font-medium bg-ink text-white rounded-lg px-4 py-2
            hover:bg-ink/90 active:scale-[0.99] transition-all"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}

function AuthedNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const initial = user?.name?.trim()?.[0]?.toUpperCase() || "U";

  function handleLogout() {
    setMenuOpen(false);
    dispatch(logout());
    navigate("/login");
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-serif text-xl font-semibold text-ink shrink-0">
          Learnly
        </Link>
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Avatar + dropdown */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-paper transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center text-sm font-medium shrink-0">
            {initial}
          </span>
          <ChevronDown className={`w-4 h-4 text-ink-soft transition-transform ${menuOpen ? "rotate-180" : ""}`} />
        </button>

        {menuOpen && (
          <>
            {/* click-away layer */}
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-rule rounded-lg shadow-lg py-1 z-20">
              <p className="px-4 py-2 text-sm text-ink-soft truncate border-b border-rule mb-1">
                {user?.email || "Signed in"}
              </p>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-paper transition-colors"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Navbar() {
  const token = useSelector((state) => state.auth.token);

  return (
    <header className="border-b border-rule bg-white sticky top-0 z-30">
      {token ? <AuthedNavbar /> : <GuestNavbar />}
    </header>
  );
}