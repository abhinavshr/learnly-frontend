import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertTriangle,
  Target,
  TrendingUp,
  Loader2,
  AlertCircle,
  Zap,
} from "lucide-react";
import { fetchTopicStats } from "../features/analytics/analyticsSlice.js";
import { generateQuiz } from "../features/quiz/quizSlice.js";

function accuracyColor(accuracy) {
  if (accuracy < 60) return "bg-error";
  if (accuracy < 80) return "bg-marigold";
  return "bg-emerald-600";
}

function accuracyTextColor(accuracy) {
  if (accuracy < 60) return "text-error";
  if (accuracy < 80) return "text-marigold";
  return "text-emerald-700";
}

function StatTile({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white border border-rule rounded-xl p-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${accent}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <p className="font-serif text-2xl font-semibold text-ink">{value}</p>
      <p className="text-sm text-ink-soft">{label}</p>
    </div>
  );
}

function TopicRow({ item }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPracticing, setIsPracticing] = useState(false);

  async function handlePractice() {
    setIsPracticing(true);
    const result = await dispatch(
      generateQuiz({ documentId: item.documentId, count: 5, difficulty: "medium", topic: item.topic })
    );
    setIsPracticing(false);
    if (generateQuiz.fulfilled.match(result)) {
      navigate(`/quizzes/${result.payload.quiz.id}/attempt`);
    }
  }

  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-rule last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-ink truncate">{item.topic}</p>
          {item.isWeak && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-error bg-error/10 rounded-full px-2 py-0.5 shrink-0">
              <AlertTriangle className="w-3 h-3" />
              Weak
            </span>
          )}
        </div>
        <p className="text-sm text-ink-soft truncate mb-2">{item.documentTitle}</p>
        <div className="h-1.5 rounded-full bg-rule/50 overflow-hidden max-w-xs">
          <div
            className={`h-full rounded-full transition-all duration-500 ${accuracyColor(item.accuracy)}`}
            style={{ width: `${item.accuracy}%` }}
          />
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className={`font-serif text-xl font-semibold ${accuracyTextColor(item.accuracy)}`}>
          {item.accuracy}%
        </p>
        <p className="text-xs text-ink-soft">{item.correct}/{item.total} correct</p>
      </div>

      <button
        onClick={handlePractice}
        disabled={isPracticing}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-rule px-3 py-2
          text-sm font-medium text-ink hover:bg-paper transition-colors
          disabled:opacity-50 disabled:pointer-events-none"
        aria-label={`Practice ${item.topic}`}
      >
        {isPracticing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-marigold" />}
        Practice
      </button>
    </div>
  );
}

export default function AnalyticsPage() {
  const dispatch = useDispatch();
  const { topics, status, error } = useSelector((state) => state.analytics);

  const [documentFilter, setDocumentFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchTopicStats());
  }, [dispatch]);

  const documentOptions = useMemo(() => {
    const seen = new Map();
    for (const t of topics) seen.set(t.documentId, t.documentTitle);
    return [{ id: "all", title: "All documents" }, ...[...seen].map(([id, title]) => ({ id, title }))];
  }, [topics]);

  const filtered = useMemo(() => {
    return [...topics]
      .filter((t) => documentFilter === "all" || t.documentId === documentFilter)
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [topics, documentFilter]);

  const weakCount = topics.filter((t) => t.isWeak).length;
  const totalCorrect = topics.reduce((s, t) => s + t.correct, 0);
  const totalAnswered = topics.reduce((s, t) => s + t.total, 0);
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const documentCount = new Set(topics.map((t) => t.documentId)).size;

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 w-full">
      <h1 className="font-serif text-3xl font-semibold text-ink mb-1">Your weak topics</h1>
      <p className="text-ink-soft mb-8">
        Based on every quiz you've taken, sorted from weakest to strongest.
      </p>

      {status === "loading" && (
        <div className="rounded-xl border border-rule bg-white py-16 text-center">
          <Loader2 className="w-6 h-6 text-ink-soft animate-spin mx-auto mb-3" />
          <p className="text-sm text-ink-soft">Loading your stats...</p>
        </div>
      )}

      {status === "failed" && (
        <div className="flex items-center gap-2 text-sm text-error bg-error/10 border border-error/30 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {status === "succeeded" && topics.length === 0 && (
        <div className="rounded-xl border border-dashed border-rule bg-white py-16 text-center">
          <Target className="w-8 h-8 text-ink-soft mx-auto mb-3" />
          <p className="font-medium text-ink mb-1">No quiz data yet</p>
          <p className="text-sm text-ink-soft">Take a quiz on a document to see your weak topics here.</p>
        </div>
      )}

      {status === "succeeded" && topics.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatTile icon={AlertTriangle} label="Weak topics" value={weakCount} accent="bg-error/10 text-error" />
            <StatTile icon={TrendingUp} label="Overall accuracy" value={`${overallAccuracy}%`} accent="bg-marigold/10 text-marigold" />
            <StatTile icon={Target} label="Documents tracked" value={documentCount} accent="bg-emerald-50 text-emerald-700" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <select
              value={documentFilter}
              onChange={(e) =>
                setDocumentFilter(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              className="rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink
                focus:outline-none focus:ring-4 focus:ring-marigold/20 focus:border-marigold w-fit"
            >
              {documentOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>

          {filtered.length > 0 ? (
            <div className="rounded-xl border border-rule bg-white overflow-hidden">
              {filtered.map((item) => (
                <TopicRow key={`${item.documentId}-${item.topic}`} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-rule bg-white py-16 text-center">
              <Target className="w-8 h-8 text-ink-soft mx-auto mb-3" />
              <p className="font-medium text-ink mb-1">No topics for this document yet</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}