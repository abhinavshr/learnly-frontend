import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, ChevronRight, Plus, Loader2, AlertCircle } from "lucide-react";
import { fetchPlans } from "../features/studyPlans/studyPlansSlice.js";
import NewPlanModal from "../components/studyPlans/NewPlanModal.jsx";

function daysUntil(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Past";
  if (diff === 0) return "Today";
  return `${diff} day${diff === 1 ? "" : "s"} left`;
}

export default function StudyPlansListPage() {
  const dispatch = useDispatch();
  const { plans, status, error } = useSelector((state) => state.studyPlans.list);
  const [showNewPlan, setShowNewPlan] = useState(false);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 w-full">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink mb-1">Study plans</h1>
          <p className="text-ink-soft">A day-by-day schedule built around your exam date.</p>
        </div>
        <button
          onClick={() => setShowNewPlan(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-ink text-white font-medium
            px-4 py-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all shrink-0
            focus:outline-none focus:ring-4 focus:ring-marigold/30"
        >
          <Plus className="w-4 h-4" />
          New plan
        </button>
      </div>

      {status === "loading" && (
        <div className="rounded-xl border border-rule bg-white py-16 text-center">
          <Loader2 className="w-6 h-6 text-ink-soft animate-spin mx-auto" />
        </div>
      )}

      {status === "failed" && (
        <div className="flex items-center gap-2 text-sm text-error bg-error/10 border border-error/30 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {status === "succeeded" && plans.length === 0 && (
        <div className="rounded-xl border border-dashed border-rule bg-white py-16 text-center">
          <Calendar className="w-8 h-8 text-ink-soft mx-auto mb-3" />
          <p className="font-medium text-ink mb-1">No study plans yet</p>
          <p className="text-sm text-ink-soft mb-4">Pick an exam date and let Learnly build your schedule.</p>
          <button
            onClick={() => setShowNewPlan(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-ink text-white font-medium px-4 py-2 text-sm hover:bg-ink/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New plan
          </button>
        </div>
      )}

      {status === "succeeded" && plans.length > 0 && (
        <div className="rounded-xl border border-rule bg-white overflow-hidden">
          {plans.map((plan) => {
            const pct = plan.totalDays > 0 ? Math.round((plan.completedDays / plan.totalDays) * 100) : 0;
            return (
              <Link
                key={plan.id}
                to={`/study-plans/${plan.id}`}
                className="flex items-center gap-4 px-5 py-4 border-b border-rule last:border-b-0 hover:bg-paper transition-colors"
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
                    <div className="h-full rounded-full bg-marigold transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-ink-soft shrink-0" />
              </Link>
            );
          })}
        </div>
      )}

      {showNewPlan && <NewPlanModal onClose={() => setShowNewPlan(false)} />}
    </main>
  );
}