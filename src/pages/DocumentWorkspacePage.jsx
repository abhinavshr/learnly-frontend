import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  MessageCircle,
  Sparkles,
  FileText,
  Target,
  Layers,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { fetchDocumentById, clearCurrentDocument } from "../features/documents/documentsSlice.js";
import AskTab from "./workspace/AskTab.jsx";
import ExplainTab from "./workspace/ExplainTab.jsx";
import SummaryTab from "./workspace/SummaryTab.jsx";
import QuizTab from "./workspace/QuizTab.jsx";
import FlashcardsTab from "./workspace/FlashcardsTab.jsx";

const TABS = [
  { id: "ask", label: "Ask", icon: MessageCircle },
  { id: "explain", label: "Explain", icon: Sparkles },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "quiz", label: "Quiz", icon: Target },
  { id: "flashcards", label: "Flashcards", icon: Layers },
];

export default function DocumentWorkspacePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: document, status, error } = useSelector((state) => state.documents.current);

  const [activeTab, setActiveTab] = useState("ask");

  useEffect(() => {
    dispatch(fetchDocumentById(id));
    // Clear the previous document immediately when navigating between documents,
    // so the old title/tabs don't flash before the new one loads
    return () => dispatch(clearCurrentDocument());
  }, [dispatch, id]);

  if (status === "loading" || status === "idle") {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10 w-full">
        <div className="rounded-xl border border-rule bg-white py-20 text-center">
          <Loader2 className="w-6 h-6 text-ink-soft animate-spin mx-auto mb-3" />
          <p className="text-sm text-ink-soft">Loading document...</p>
        </div>
      </main>
    );
  }

  if (status === "failed") {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10 w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to documents
        </Link>
        <div className="rounded-xl border border-error/30 bg-error/5 py-14 text-center">
          <AlertCircle className="w-6 h-6 text-error mx-auto mb-3" />
          <p className="text-sm text-error">{error}</p>
        </div>
      </main>
    );
  }

  // Document exists but isn't ready yet (still PROCESSING, or FAILED extraction)
  if (document.status !== "READY") {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10 w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to documents
        </Link>
        <h1 className="font-serif text-3xl font-semibold text-ink mb-6">{document.title}</h1>

        <div className="rounded-xl border border-rule bg-white py-14 text-center">
          {document.status === "PROCESSING" ? (
            <>
              <Loader2 className="w-6 h-6 text-ink-soft animate-spin mx-auto mb-3" />
              <p className="text-sm text-ink-soft">Still processing this document — check back in a moment.</p>
            </>
          ) : (
            <>
              <AlertCircle className="w-6 h-6 text-error mx-auto mb-3" />
              <p className="text-sm text-error">{document.errorMessage || "This document failed to process."}</p>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-8 w-full">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to documents
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">{document.title}</h1>
        <span className="inline-flex items-center gap-1.5 text-sm text-ink-soft shrink-0 mt-1.5">
          <Clock className="w-3.5 h-3.5" />
          {document.pageCount ? `${document.pageCount} pages` : ""}
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-rule mb-8 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px
                whitespace-nowrap transition-colors
                ${isActive ? "border-marigold text-ink" : "border-transparent text-ink-soft hover:text-ink"}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content — still static for now, wired in later steps */}
      {activeTab === "ask" && <AskTab documentId={document.id} />}
      {activeTab === "explain" && <ExplainTab documentId={document.id} />}
      {activeTab === "summary" && <SummaryTab documentId={document.id} />}
      {activeTab === "quiz" && <QuizTab documentId={document.id} />}
      {activeTab === "flashcards" && <FlashcardsTab documentId={document.id} />}
    </main>
  );
}