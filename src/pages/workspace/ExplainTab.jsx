import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sparkles, Loader2, AlertCircle, FileText } from "lucide-react";
import { explainTopic } from "../../features/explain/explainSlice.js";
import MarkdownContent from "../../components/MarkdownContent.jsx";

const LEVELS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export default function ExplainTab({ documentId }) {
  const dispatch = useDispatch();
  const entry = useSelector((state) => state.explain.byDocument[documentId]);

  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("beginner");

  const isLoading = entry?.status === "loading";
  const error = entry?.error;
  const hasResult = entry?.status === "succeeded" && entry.explanation;

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed || isLoading) return;
    dispatch(explainTopic({ documentId, topic: trimmed, level }));
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What topic do you want explained?"
          disabled={isLoading}
          className="flex-1 rounded-lg border border-rule bg-white px-4 py-2.5 text-sm text-ink
            placeholder:text-ink-soft/50 focus:outline-none focus:ring-4 focus:ring-marigold/20
            focus:border-marigold transition-shadow disabled:bg-paper"
        />
        <div className="flex rounded-lg border border-rule bg-white p-1 shrink-0">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLevel(l.id)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${level === l.id ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={!topic.trim() || isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-marigold text-ink font-medium
            px-5 py-2.5 hover:bg-marigold/90 active:scale-[0.99] transition-all shrink-0
            disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Explain
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 text-sm text-error bg-error/10 border border-error/30 rounded-lg px-4 py-3 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {isLoading && (
        <div className="bg-white border border-rule rounded-xl py-16 text-center">
          <Loader2 className="w-6 h-6 text-ink-soft animate-spin mx-auto mb-3" />
          <p className="text-sm text-ink-soft">Reading your document and writing an explanation...</p>
        </div>
      )}

      {!isLoading && hasResult && (
        <article className="bg-white border border-rule rounded-xl p-8">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-soft mb-6">
            <Sparkles className="w-3.5 h-3.5 text-marigold" />
            Explained for a {entry.level}
            {entry.sources?.length > 0 && (
              <>
                {" · "}
                {entry.sources.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1 ml-1">
                    <FileText className="w-3 h-3" />
                    {s.pageNumber}
                  </span>
                ))}
              </>
            )}
          </div>

          <MarkdownContent content={entry.explanation} />
        </article>
      )}

      {!isLoading && !hasResult && !error && (
        <div className="bg-white border border-dashed border-rule rounded-xl py-16 text-center">
          <Sparkles className="w-6 h-6 text-ink-soft mx-auto mb-3" />
          <p className="text-ink font-medium mb-1">Pick a topic to get a beginner-friendly explanation</p>
          <p className="text-sm text-ink-soft">Grounded entirely in this document — nothing invented.</p>
        </div>
      )}
    </div>
  );
}