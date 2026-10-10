import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { loadSummary, regenerateSummary } from "../../features/summary/summarySlice.js";
import MarkdownContent from "../../components/MarkdownContent.jsx";

const LENGTHS = [
  { id: "short", label: "Short" },
  { id: "medium", label: "Medium" },
  { id: "detailed", label: "Detailed" },
];

export default function SummaryTab({ documentId }) {
  const dispatch = useDispatch();
  const [length, setLength] = useState("medium");

  const key = `${documentId}:${length}`;
  const entry = useSelector((state) => state.summary.byKey[key]);

  const isLoading = entry?.status === "loading";
  const error = entry?.error;
  const hasResult = entry?.status === "succeeded" && entry.content;

  useEffect(() => {
    if (!entry || entry.status === "idle") {
      dispatch(loadSummary({ documentId, length }));
    }
    // entry is intentionally excluded: including it would re-trigger on every
    // status change and cause a fetch loop. Only documentId/length should re-fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, documentId, length]);

  function handleRegenerate() {
    dispatch(regenerateSummary({ documentId, length }));
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex rounded-lg border border-rule bg-white p-1">
          {LENGTHS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLength(l.id)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${length === l.id ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink
            transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Regenerate
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-error bg-error/10 border border-error/30 rounded-lg px-4 py-3 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {isLoading && (
        <div className="bg-white border border-rule rounded-xl py-16 text-center">
          <Loader2 className="w-6 h-6 text-ink-soft animate-spin mx-auto mb-3" />
          <p className="text-sm text-ink-soft">
            {length === "detailed"
              ? "This can take a little longer for a detailed summary..."
              : "Summarizing your document..."}
          </p>
        </div>
      )}

      {!isLoading && hasResult && (
        <article className="bg-white border border-rule rounded-xl p-8">
          <MarkdownContent content={entry.content} />
        </article>
      )}
    </div>
  );
}