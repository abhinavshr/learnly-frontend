import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  FileText,
  MoreVertical,
  Search,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Static placeholder data — no backend call yet
const DOCUMENTS = [
  {
    id: 1,
    title: "Cell Biology — Chapter 4",
    pageCount: 22,
    status: "ready",
    uploadedAt: "2 days ago",
  },
  {
    id: 2,
    title: "Ticketing System PRD",
    pageCount: 29,
    status: "ready",
    uploadedAt: "5 days ago",
  },
  {
    id: 3,
    title: "Macroeconomics — Week 6 Notes",
    pageCount: 14,
    status: "processing",
    uploadedAt: "just now",
  },
  {
    id: 4,
    title: "Scanned Lecture Slides",
    pageCount: null,
    status: "failed",
    uploadedAt: "1 week ago",
  },
];

const STATUS_CONFIG = {
  ready: { label: "Ready", icon: CheckCircle2, className: "text-emerald-700 bg-emerald-50" },
  processing: { label: "Processing", icon: Loader2, className: "text-ink-soft bg-rule/30" },
  failed: { label: "Failed", icon: AlertCircle, className: "text-error bg-error/10" },
};

function StatusPill({ status }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon className={`w-3.5 h-3.5 ${status === "processing" ? "animate-spin" : ""}`} />
      {config.label}
    </span>
  );
}

function DocumentRow({ doc }) {
  const isUsable = doc.status === "ready";

  const row = (
    <div
      className={`flex items-center gap-4 px-5 py-4 border-b border-rule
        ${isUsable ? "hover:bg-paper cursor-pointer transition-colors" : ""}`}
    >
      <div className="w-9 h-9 rounded-lg bg-marigold/10 flex items-center justify-center shrink-0">
        <FileText className="w-4.5 h-4.5 text-marigold" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-ink truncate">{doc.title}</p>
        <p className="text-sm text-ink-soft">
          {doc.pageCount ? `${doc.pageCount} pages` : "—"} · Uploaded {doc.uploadedAt}
        </p>
      </div>

      <StatusPill status={doc.status} />

      <button
        onClick={(e) => e.preventDefault()}
        className="p-1.5 rounded-md text-ink-soft hover:text-ink hover:bg-rule/30 transition-colors"
        aria-label="More options"
      >
        <MoreVertical className="w-4.5 h-4.5" />
      </button>
    </div>
  );

  return isUsable ? (
    <Link to={`/documents/${doc.id}`} className="block">
      {row}
    </Link>
  ) : (
    <div>{row}</div>
  );
}

export default function DashboardPage() {
  const [search, setSearch] = useState("");

  const filtered = DOCUMENTS.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-paper">

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-ink mb-1">
              Your documents
            </h1>
            <p className="text-ink-soft">
              Upload a PDF and Learnly turns it into questions, quizzes and flashcards.
            </p>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-lg bg-ink text-white font-medium
              px-4 py-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all shrink-0
              focus:outline-none focus:ring-4 focus:ring-marigold/30"
          >
            <Upload className="w-4 h-4" />
            Upload PDF
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your documents"
            className="w-full sm:w-80 rounded-lg border border-rule bg-white pl-10 pr-3 py-2.5
              text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-4
              focus:ring-marigold/20 focus:border-marigold transition-shadow"
          />
        </div>

        {/* Document list */}
        {filtered.length > 0 ? (
          <div className="rounded-xl border border-rule bg-white overflow-hidden">
            {filtered.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-rule bg-white py-16 text-center">
            <FileText className="w-8 h-8 text-ink-soft mx-auto mb-3" />
            <p className="font-medium text-ink mb-1">No documents match "{search}"</p>
            <p className="text-sm text-ink-soft">Try a different search, or upload something new.</p>
          </div>
        )}
      </main>
    </div>
  );
}