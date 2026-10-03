import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  AlertTriangle,
  FileText,
  Target,
  Layers,
  BookOpen,
} from "lucide-react";

// Static mock — matches the shape GET /api/study-plans/:id returns
const PLAN = {
  title: "Ticketing System exam prep",
  examDate: "2026-10-15",
  hoursPerDay: 1.5,
};

const DAYS = [
  {
    dayIndex: 1,
    date: "2026-09-20",
    focus: "Start strong by reviewing payments, since that's your weakest area.",
    isDone: true,
    tasks: [
      { type: "weak_topic_quiz", topic: "Payments", minutes: 20 },
      { type: "read_summary", minutes: 15 },
    ],
  },
  {
    dayIndex: 2,
    date: "2026-09-21",
    focus: "Build on yesterday with a general practice quiz across the document.",
    isDone: true,
    tasks: [
      { type: "practice_quiz", minutes: 20 },
      { type: "flashcard_review", minutes: 10 },
    ],
  },
  {
    dayIndex: 3,
    date: "2026-09-22",
    focus: "Revisit tournament formats, then a quick flashcard pass.",
    isDone: false,
    tasks: [
      { type: "weak_topic_quiz", topic: "Tournament formats", minutes: 20 },
      { type: "flashcard_review", minutes: 10 },
      { type: "read_summary", minutes: 15 },
    ],
  },
  {
    dayIndex: 4,
    date: "2026-09-23",
    focus: "A full practice quiz to check how everything is sticking.",
    isDone: false,
    tasks: [{ type: "practice_quiz", minutes: 30 }],
  },
  {
    dayIndex: 15,
    date: "2026-10-04",
    focus: "Light review only — no new material the day before.",
    isDone: false,
    tasks: [{ type: "final_review", minutes: 45 }],
  },
];

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
  const [days, setDays] = useState(DAYS);
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const firstUnfinished = DAYS.findIndex((d) => !d.isDone);
    return firstUnfinished === -1 ? 0 : firstUnfinished;
  });

  const selectedDay = days[selectedIndex];
  const completedCount = days.filter((d) => d.isDone).length;
  const progressPct = Math.round((completedCount / days.length) * 100);

  function toggleDayDone(index) {
    setDays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, isDone: !d.isDone } : d))
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-rule bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-serif text-xl font-semibold text-ink">Learnly</span>
          <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center text-sm font-medium">
            A
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link
          to="/study-plans"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to study plans
        </Link>

        <div className="flex items-start justify-between mb-2">
          <h1 className="font-serif text-3xl font-semibold text-ink">{PLAN.title}</h1>
        </div>
        <p className="text-ink-soft mb-6">
          Exam on {formatDate(PLAN.examDate)} · {PLAN.hoursPerDay}h/day · {completedCount}/{days.length} days done
        </p>

        {/* Overall progress */}
        <div className="h-2 rounded-full bg-rule/50 overflow-hidden mb-8">
          <div
            className="h-full rounded-full bg-marigold transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
          {/* Day list sidebar */}
          <div className="rounded-xl border border-rule bg-white overflow-hidden h-fit md:max-h-[520px] md:overflow-y-auto">
            {days.map((day, i) => {
              const isSelected = i === selectedIndex;
              return (
                <button
                  key={day.dayIndex}
                  onClick={() => setSelectedIndex(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-rule
                    last:border-b-0 transition-colors
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

          {/* Selected day detail */}
          <div className="bg-white border border-rule rounded-xl p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif text-xl font-semibold text-ink">
                Day {selectedDay.dayIndex} · {formatDate(selectedDay.date)}
              </h2>
              <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedDay.isDone}
                  onChange={() => toggleDayDone(selectedIndex)}
                  className="w-4 h-4 rounded border-rule accent-[#E8A33D]"
                />
                Mark done
              </label>
            </div>
            <p className="text-ink-soft mb-6">{selectedDay.focus}</p>

            <div className="space-y-3">
              {selectedDay.tasks.map((task, i) => {
                const config = TASK_CONFIG[task.type];
                const Icon = config.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-rule px-4 py-3"
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink">{config.label}</p>
                      {task.topic && <p className="text-xs text-ink-soft">{task.topic}</p>}
                    </div>
                    <span className="text-xs text-ink-soft shrink-0">{task.minutes} min</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}