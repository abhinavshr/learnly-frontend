import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Check,
  AlertTriangle,
  FileText,
  Target,
  Layers,
  BookOpen,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import {
  fetchPlanById,
  updateDayDone,
  deletePlan,
  clearCurrentPlan,
} from "../features/studyPlans/studyPlansSlice.js";

const TASK_CONFIG = {
  weak_topic_quiz: { icon: AlertTriangle, label: "Quiz your weak topic", color: "text-error bg-error/10" },
  read_summary: { icon: FileText, label: "Read the summary", color: "text-ink-soft bg-rule/30" },
  practice_quiz: { icon: Target, label: "Take a practice quiz", color: "text-marigold bg-marigold/10" },
  flashcard_review: { icon: Layers, label: "Review flashcards", color: "text-emerald-700 bg-emerald-50" },
  final_review: { icon: BookOpen, label: "Final review", color: "text-ink bg-ink/10" },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export default function StudyPlanPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plan, days, status, error } = useSelector((state) => state.studyPlans.current);
  const { deletingId } = useSelector((state) => state.studyPlans);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchPlanById(id));
    return () => dispatch(clearCurrentPlan());
  }, [dispatch, id]);

  // Default the selected day to the first unfinished one once days load
  useEffect(() => {
    if (status === "succeeded" && days.length > 0) {
      const firstUnfinished = days.findIndex((d) => !d.isDone);
      setSelectedIndex(firstUnfinished === -1 ? 0 : firstUnfinished);
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleDayDone(day) {
    dispatch(updateDayDone({ planId: plan.id, dayIndex: day.dayIndex, isDone: !day.isDone }));
  }

  async function handleDelete() {
    const result = await dispatch(deletePlan(plan.id));
    if (deletePlan.fulfilled.match(result)) {
      navigate("/study-plans");
    }
  }

  if (status === "loading" || status === "idle") {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10 w-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-ink-soft animate-spin" />
      </main>
    );
  }

  if (status === "failed") {
    return (
      <main className="max-w-4xl mx-auto px-6 py-10 w-full">
        <Link to="/study-plans" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to study plans
        </Link>
        <div className="flex items-center gap-2 text-sm text-error bg-error/10 border border-error/30 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      </main>
    );
  }

  const selectedDay = days[selectedIndex];
  const completedCount = days.filter((d) => d.isDone).length;
  const progressPct = days.length > 0 ? Math.round((completedCount / days.length) * 100) : 0;

  return (
    <main className="max-w-4xl mx-auto px-6 py-8 w-full">
      <Link to="/study-plans" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to study plans
      </Link>

      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="font-serif text-3xl font-semibold text-ink">{plan.title}</h1>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="shrink-0 inline-flex items-center gap-1.5 text-sm text-error hover:text-error/80 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete plan
        </button>
      </div>
      <p className="text-ink-soft mb-6">
        Exam on {formatDate(plan.examDate)} · {plan.hoursPerDay}h/day · {completedCount}/{days.length} days done
      </p>

      <div className="h-2 rounded-full bg-rule/50 overflow-hidden mb-8">
        <div className="h-full rounded-full bg-marigold transition-all duration-500" style={{ width: `${progressPct}%` }} />
      </div>

      {selectedDay && (
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
          <div className="rounded-xl border border-rule bg-white overflow-hidden h-fit md:max-h-[520px] md:overflow-y-auto">
            {days.map((day, i) => {
              const isSelected = i === selectedIndex;
              return (
                <button
                  key={day.dayIndex}
                  onClick={() => setSelectedIndex(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-rule last:border-b-0 transition-colors
                    ${isSelected ? "bg-marigold/10" : "hover:bg-paper"}`}
                >
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                      ${day.isDone ? "bg-emerald-600 text-white" : "bg-rule/50 text-ink-soft"}`}
                  >
                    {day.isDone ? <Check className="w-3.5 h-3.5" /> : day.dayIndex}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${isSelected ? "text-ink" : "text-ink-soft"}`}>
                      Day {day.dayIndex}
                    </p>
                    <p className="text-xs text-ink-soft truncate">{formatDate(day.date)}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white border border-rule rounded-xl p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif text-xl font-semibold text-ink">
                Day {selectedDay.dayIndex} · {formatDate(selectedDay.date)}
              </h2>
              <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedDay.isDone}
                  onChange={() => toggleDayDone(selectedDay)}
                  className="w-4 h-4 rounded border-rule accent-[#E8A33D]"
                />
                Mark done
              </label>
            </div>
            <p className="text-ink-soft mb-6">{selectedDay.focus}</p>

            <div className="space-y-3">
              {selectedDay.tasks.map((task, i) => {
                const config = TASK_CONFIG[task.type] ?? TASK_CONFIG.final_review;
                const Icon = config.icon;
                return (
                  <Link
                    key={i}
                    to={task.documentId ? `/documents/${task.documentId}` : "/study-plans"}
                    className="flex items-center gap-3 rounded-lg border border-rule px-4 py-3 hover:bg-paper transition-colors"
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink">{config.label}</p>
                      {task.topic && <p className="text-xs text-ink-soft">{task.topic}</p>}
                    </div>
                    <span className="text-xs text-ink-soft shrink-0">{task.minutes} min</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-6 z-40">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h2 className="font-serif text-xl font-semibold text-ink mb-2">Delete this plan?</h2>
            <p className="text-ink-soft text-sm mb-6">This can't be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-lg border border-rule py-2.5 text-sm font-medium text-ink hover:bg-paper transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deletingId === plan.id}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-error text-white py-2.5 text-sm font-medium hover:bg-error/90 transition-colors disabled:opacity-50"
              >
                {deletingId === plan.id && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}