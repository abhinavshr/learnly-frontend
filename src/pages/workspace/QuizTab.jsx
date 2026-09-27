import { useState } from "react";
import { Link } from "react-router-dom";
import { Target, ChevronRight } from "lucide-react";

const DIFFICULTIES = ["easy", "medium", "hard"];

const PAST_QUIZZES = [
  { id: 1, title: "Ticketing Documentation Quiz", difficulty: "medium", questionCount: 5, createdAt: "2 days ago" },
  { id: 2, title: "Ticketing Documentation - Payments", difficulty: "hard", questionCount: 5, createdAt: "5 days ago" },
  { id: 4, title: "Ticketing Documentation - Weak topics", difficulty: "easy", questionCount: 5, createdAt: "just now" },
];

export default function QuizTab() {
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");

  return (
    <div className="max-w-2xl">
      <div className="bg-white border border-rule rounded-xl p-6 mb-8">
        <h2 className="font-serif text-xl font-semibold text-ink mb-4">Generate a new quiz</h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-5">
          <label className="flex-1">
            <span className="block text-sm font-medium text-ink mb-1.5">Number of questions</span>
            <input
              type="number"
              min={3}
              max={15}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-ink
                focus:outline-none focus:ring-4 focus:ring-marigold/20 focus:border-marigold"
            />
          </label>

          <div className="flex-1">
            <span className="block text-sm font-medium text-ink mb-1.5">Difficulty</span>
            <div className="flex rounded-lg border border-rule bg-white p-1">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors
                    ${difficulty === d ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          className="w-full sm:w-auto rounded-lg bg-ink text-white font-medium px-5 py-2.5
            hover:bg-ink/90 active:scale-[0.99] transition-all
            focus:outline-none focus:ring-4 focus:ring-marigold/30"
        >
          Generate quiz
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-ink">Past quizzes</h3>
        <Link to="#" className="text-sm text-ink-soft hover:text-ink transition-colors">
          Quiz my weak topics
        </Link>
      </div>

      <div className="rounded-xl border border-rule bg-white overflow-hidden">
        {PAST_QUIZZES.map((q) => (
          <div
            key={q.id}
            className="flex items-center gap-4 px-5 py-4 border-b border-rule last:border-b-0
              hover:bg-paper cursor-pointer transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-marigold/10 flex items-center justify-center shrink-0">
              <Target className="w-4.5 h-4.5 text-marigold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-ink truncate">{q.title}</p>
              <p className="text-sm text-ink-soft capitalize">
                {q.questionCount} questions · {q.difficulty} · {q.createdAt}
              </p>
            </div>
            <ChevronRight className="w-4.5 h-4.5 text-ink-soft" />
          </div>
        ))}
      </div>
    </div>
  );
}