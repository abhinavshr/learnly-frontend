import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, ChevronRight, Plus } from "lucide-react";

// Static mock — matches the shape GET /api/study-plans returns
const PLANS = [
  {
    id: 1,
    title: "Ticketing System exam prep",
    examDate: "2026-10-15",
    totalDays: 15,
    completedDays: 6,
  },
  {
    id: 2,
    title: "Cell Biology — Chapter 4 review",
    examDate: "2026-10-05",
    totalDays: 8,
    completedDays: 8,
  },
];

function daysUntil(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Past";
  if (diff === 0) return "Today";
  return `${diff} day${diff === 1 ? "" : "s"} left`;
}

export default function StudyPlansListPage() {
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

        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-ink mb-1">Study plans</h1>
            <p className="text-ink-soft">A day-by-day schedule built around your exam date.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-ink text-white font-medium
              px-4 py-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all shrink-0
              focus:outline-none focus:ring-4 focus:ring-marigold/30"
          >
            <Plus className="w-4 h-4" />
            New plan
          </button>
        </div>

        <div className="rounded-xl border border-rule bg-white overflow-hidden">
          {PLANS.map((plan) => {
            const pct = Math.round((plan.completedDays / plan.totalDays) * 100);
            return (
              <Link
                key={plan.id}
                to={`/study-plans/${plan.id}`}
                className="flex items-center gap-4 px-5 py-4 border-b border-rule last:border-b-0
                  hover:bg-paper transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-marigold/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-4.5 h-4.5 text-marigold" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{plan.title}</p>
                  <p className="text-sm text-ink-soft mb-2">
                    {daysUntil(plan.examDate)} · {plan.completedDays}/{plan.totalDays} days done
                  </p>
                  <div className="h-1.5 rounded-full bg-rule/50 overflow-hidden max-w-xs">
                    <div
                      className="h-full rounded-full bg-marigold transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <ChevronRight className="w-4.5 h-4.5 text-ink-soft shrink-0" />
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}