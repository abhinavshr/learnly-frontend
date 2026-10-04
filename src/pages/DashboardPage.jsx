import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Upload,
  FileText,
  MoreVertical,
  Search,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { fetchDocuments, deleteDocument } from "../features/documents/documentsSlice.js";
import UploadModal from "../components/dashboard/UploadModal.jsx";

const STATUS_CONFIG = {
  READY: { label: "Ready", icon: CheckCircle2, className: "text-emerald-700 bg-emerald-50" },
  PROCESSING: { label: "Processing", icon: Loader2, className: "text-ink-soft bg-rule/30" },
  FAILED: { label: "Failed", icon: AlertCircle, className: "text-error bg-error/10" },
};

function StatusPill({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PROCESSING;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
      <Icon className={`w-3.5 h-3.5 ${status === "PROCESSING" ? "animate-spin" : ""}`} />
      {config.label}
    </span>
  );
}

function formatDate(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(dateStr).toLocaleDateString();
}

function DocumentRow({ doc, onDelete, isDeleting }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isUsable = doc.status === "READY";

  const content = (
    <div
      className={`flex items-center gap-4 px-5 py-4 border-b border-rule last:border-b-0
        ${isUsable ? "hover:bg-paper cursor-pointer transition-colors" : ""}`}
    >
      <div className="w-9 h-9 rounded-lg bg-marigold/10 flex items-center justify-center shrink-0">
        <FileText className="w-4.5 h-4.5 text-marigold" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-ink truncate">{doc.title}</p>
        <p className="text-sm text-ink-soft">
          {doc.pageCount ? `${doc.pageCount} pages` : "—"} · Uploaded {formatDate(doc.createdAt)}
          {doc.status === "FAILED" && doc.errorMessage ? ` · ${doc.errorMessage}` : ""}
        </p>
      </div>

      <StatusPill status={doc.status} />

      <div className="relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen((o) => !o);
          }}
          className="p-1.5 rounded-md text-ink-soft hover:text-ink hover:bg-rule/30 transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="w-4.5 h-4.5" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={(e) => { e.preventDefault(); setMenuOpen(false); }} />
            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-rule rounded-lg shadow-lg py-1 z-20">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  onDelete(doc.id);
                }}
                disabled={isDeleting}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-error
                  hover:bg-error/5 transition-colors disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return isUsable ? (
    <Link to={`/documents/${doc.id}`} className="block">
      {content}
    </Link>
  ) : (
    <div>{content}</div>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { items, status, error, deletingId } = useSelector((state) => state.documents);

  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const filtered = items.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  function handleDeleteConfirmed() {
    dispatch(deleteDocument(confirmDeleteId));
    setConfirmDeleteId(null);
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 w-full">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink mb-1">Your documents</h1>
          <p className="text-ink-soft">
            Upload a PDF and Learnly turns it into questions, quizzes and flashcards.
          </p>
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-ink text-white font-medium
            px-4 py-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all shrink-0
            focus:outline-none focus:ring-4 focus:ring-marigold/30"
        >
          <Upload className="w-4 h-4" />
          Upload PDF
        </button>
      </div>

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

      {status === "loading" && (
        <div className="rounded-xl border border-rule bg-white py-16 text-center">
          <Loader2 className="w-6 h-6 text-ink-soft animate-spin mx-auto mb-3" />
          <p className="text-sm text-ink-soft">Loading your documents...</p>
        </div>
      )}

      {status === "failed" && (
        <div className="rounded-xl border border-error/30 bg-error/5 py-10 text-center">
          <AlertCircle className="w-6 h-6 text-error mx-auto mb-3" />
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {status === "succeeded" && filtered.length > 0 && (
        <div className="rounded-xl border border-rule bg-white overflow-hidden">
          {filtered.map((doc) => (
            <DocumentRow
              key={doc.id}
              doc={doc}
              isDeleting={deletingId === doc.id}
              onDelete={setConfirmDeleteId}
            />
          ))}
        </div>
      )}

      {status === "succeeded" && filtered.length === 0 && items.length > 0 && (
        <div className="rounded-xl border border-dashed border-rule bg-white py-16 text-center">
          <FileText className="w-8 h-8 text-ink-soft mx-auto mb-3" />
          <p className="font-medium text-ink mb-1">No documents match "{search}"</p>
          <p className="text-sm text-ink-soft">Try a different search, or upload something new.</p>
        </div>
      )}

      {status === "succeeded" && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-rule bg-white py-16 text-center">
          <FileText className="w-8 h-8 text-ink-soft mx-auto mb-3" />
          <p className="font-medium text-ink mb-1">No documents yet</p>
          <p className="text-sm text-ink-soft mb-4">Upload your first PDF to get started.</p>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-ink text-white font-medium
              px-4 py-2 text-sm hover:bg-ink/90 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload PDF
          </button>
        </div>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-6 z-40">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h2 className="font-serif text-xl font-semibold text-ink mb-2">Delete this document?</h2>
            <p className="text-ink-soft text-sm mb-6">
              This removes the document along with its chunks, quizzes and flashcards. This can't be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 rounded-lg border border-rule py-2.5 text-sm font-medium text-ink hover:bg-paper transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="flex-1 rounded-lg bg-error text-white py-2.5 text-sm font-medium hover:bg-error/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}