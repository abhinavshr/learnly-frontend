import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-rule bg-white">
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          © {new Date().getFullYear()} Learnly. Built from your own documents.
        </p>
        <div className="flex items-center gap-5 text-sm text-ink-soft">
          <Link to="#" className="hover:text-ink transition-colors">Privacy</Link>
          <Link to="#" className="hover:text-ink transition-colors">Terms</Link>
          <a href="#" className="hover:text-ink transition-colors">Help</a>
        </div>
      </div>
    </footer>
  );
}