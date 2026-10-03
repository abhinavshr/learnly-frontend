import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Target, TrendingUp, ChevronRight } from "lucide-react";

// Static mock — matches the shape GET /api/analytics/topics returns
const TOPICS = [
  { documentId: 3, documentTitle: "Ticketing Documentation", topic: "Payments", correct: 1, total: 4, accuracy: 25, isWeak: true },
  { documentId: 3, documentTitle: "Ticketing Documentation", topic: "Tournament formats", correct: 3, total: 6, accuracy: 50, isWeak: true },
  { documentId: 1, documentTitle: "Cell Biology — Chapter 4", topic: "Cellular respiration", correct: 2, total: 5, accuracy: 40, isWeak: true },
  { documentId: 3, documentTitle: "Ticketing Documentation", topic: "Check-in", correct: 3, total: 5, accuracy: 60, isWeak: false },
  { documentId: 1, documentTitle: "Cell Biology — Chapter 4", topic: "Cell structure", correct: 6, total: 7, accuracy: 86, isWeak: false },
  { documentId: 3, documentTitle: "Ticketing Documentation", topic: "Order statuses", correct: 5, total: 5, accuracy: 100, isWeak: false },
];

const DOCUMENTS = [
  { id: "all", title: "All documents" },
  { id: 3, title: "Ticketing Documentation" },
  { id: 1, title: "Cell Biology — Chapter 4" },
];

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

      <Link
        to={`/documents/${item.documentId}`}
        className="shrink-0 p-2 rounded-md text-ink-soft hover:text-ink hover:bg-paper transition-colors"
        aria-label={`Practice ${item.topic}`}
      >
        <ChevronRight className="w-4.5 h-4.5" />
      </Link>
    </div>
  );
}

export default function AnalyticsPage() {
  const [documentFilter, setDocumentFilter] = useState("all");

  const filtered = useMemo(() => {
    return TOPICS.filter((t) => documentFilter === "all" || t.documentId === documentFilter).sort(
      (a, b) => a.accuracy - b.accuracy
    );
  }, [documentFilter]);

  const weakCount = TOPICS.filter((t) => t.isWeak).length;
  const overallAccuracy = Math.round(
    (TOPICS.reduce((s, t) => s + t.correct, 0) / TOPICS.reduce((s, t) => s + t.total, 0)) * 100
  );
  const documentCount = new Set(TOPICS.map((t) => t.documentId)).size;

  return (
    <div className="min-h-screen bg-paper">

      <main className="max-w-4xl mx-auto px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to documents
        </Link>

        <h1 className="font-serif text-3xl font-semibold text-ink mb-1">Your weak topics</h1>
        <p className="text-ink-soft mb-8">
          Based on every quiz you've taken, sorted from weakest to strongest.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatTile
            icon={AlertTriangle}
            label="Weak topics"
            value={weakCount}
            accent="bg-error/10 text-error"
          />
          <StatTile
            icon={TrendingUp}
            label="Overall accuracy"
            value={`${overallAccuracy}%`}
            accent="bg-marigold/10 text-marigold"
          />
          <StatTile
            icon={Target}
            label="Documents tracked"
            value={documentCount}
            accent="bg-emerald-50 text-emerald-700"
          />
        </div>

        {/* Filter + action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <select
            value={documentFilter}
            onChange={(e) =>
              setDocumentFilter(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="rounded-lg border border-rule bg-white px-3 py-2 text-sm text-ink
              focus:outline-none focus:ring-4 focus:ring-marigold/20 focus:border-marigold w-fit"
          >
            {DOCUMENTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>

          <button
            className="inline-flex items-center justify-center rounded-lg bg-ink text-white
              font-medium px-4 py-2 text-sm hover:bg-ink/90 active:scale-[0.99] transition-all
              focus:outline-none focus:ring-4 focus:ring-marigold/30"
          >
            Quiz all weak topics
          </button>
        </div>

        {/* Topic list */}
        {filtered.length > 0 ? (
          <div className="rounded-xl border border-rule bg-white overflow-hidden">
            {filtered.map((item) => (
              <TopicRow key={`${item.documentId}-${item.topic}`} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-rule bg-white py-16 text-center">
            <Target className="w-8 h-8 text-ink-soft mx-auto mb-3" />
            <p className="font-medium text-ink mb-1">No quiz data yet</p>
            <p className="text-sm text-ink-soft">Take a quiz on a document to see your weak topics here.</p>
          </div>
        )}
      </main>
    </div>
  );
}