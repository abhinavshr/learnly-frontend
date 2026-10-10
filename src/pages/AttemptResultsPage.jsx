import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Check, X, ChevronDown, ArrowLeft, Clock, Loader2, AlertCircle } from "lucide-react";
import { fetchAttemptResults, resetResults } from "../features/attempt/attemptSlice.js";

const LETTERS = ["A", "B", "C", "D"];

function scoreMessage(pct) {
  if (pct >= 80) return "Strong work.";
  if (pct >= 60) return "Good progress — a bit more practice will help.";
  return "Worth another pass through the weak spots below.";
}

function TopicBar({ topic }) {
  const isWeak = topic.accuracy < 60;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-ink">{topic.topic}</span>
        <span className={`text-sm font-medium ${isWeak ? "text-error" : "text-ink-soft"}`}>
          {topic.correct}/{topic.total} · {topic.accuracy}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-rule/50 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isWeak ? "bg-error" : "bg-marigold"}`}
          style={{ width: `${topic.accuracy}%` }}
        />
      </div>
    </div>
  );
}

function QuestionReview({ result, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-rule rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <span
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center
            ${result.isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-error/10 text-error"}`}
        >
          {result.isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </span>
        <span className="flex-1 text-ink font-medium">
          {index + 1}. {result.question}
        </span>
        <ChevronDown className={`w-4 h-4 text-ink-soft shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-rule">
          <div className="space-y-2 mb-4">
            {result.options.map((option, i) => {
              const isCorrectOption = i === result.correctIndex;
              const isSelectedWrong = i === result.selectedIndex && !result.isCorrect;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm
                    ${isCorrectOption
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                      : isSelectedWrong
                      ? "border-error bg-error/10 text-ink"
                      : "border-rule text-ink-soft"}`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/70 flex items-center justify-center text-xs font-medium shrink-0">
                    {LETTERS[i]}
                  </span>
                  {option}
                  {isCorrectOption && <Check className="w-4 h-4 ml-auto text-emerald-700" />}
                  {isSelectedWrong && <X className="w-4 h-4 ml-auto text-error" />}
                </div>
              );
            })}
          </div>
          <p className="text-sm text-ink-soft leading-relaxed">
            <span className="font-medium text-ink">Why: </span>
            {result.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export default function AttemptResultsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { attempt, topics, results, status, error } = useSelector((state) => state.attempt.results);

  useEffect(() => {
    dispatch(fetchAttemptResults(id));
    return () => dispatch(resetResults());
  }, [dispatch, id]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-ink-soft animate-spin" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <AlertCircle className="w-6 h-6 text-error mx-auto mb-3" />
          <p className="text-sm text-error mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-rule px-4 py-2
              text-sm font-medium text-ink hover:bg-white transition-colors"
          >
            Back to documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="bg-ink px-6 py-14">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to documents
          </Link>

          <div className="flex items-end gap-6">
            <span className="font-serif text-7xl font-semibold text-white leading-none">
              {attempt.percentage}%
            </span>
            <div className="pb-2">
              <p className="text-white font-medium">
                {attempt.score} of {attempt.totalQuestions} correct
              </p>
              <p className="text-white/50 text-sm capitalize">{attempt.mode} mode</p>
            </div>
          </div>

          <p className="text-white/70 mt-4">{scoreMessage(attempt.percentage)}</p>

          {attempt.timedOut && (
            <div className="inline-flex items-center gap-1.5 text-sm text-marigold bg-marigold/10 rounded-full px-3 py-1 mt-4">
              <Clock className="w-3.5 h-3.5" />
              Submitted after time ran out
            </div>
          )}
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {topics.length > 0 && (
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-ink mb-4">By topic</h2>
            <div className="bg-white border border-rule rounded-xl p-6 space-y-5">
              {topics.map((t) => (
                <TopicBar key={t.topic} topic={t} />
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <Link
            to="/analytics"
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-ink text-white
              font-medium py-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all text-center"
          >
            Review weak topics
          </Link>
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center rounded-lg border border-rule
              text-ink font-medium py-2.5 hover:bg-white transition-colors"
          >
            Back to documents
          </Link>
        </div>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ink mb-4">Review</h2>
          <div className="space-y-3">
            {results.map((result, i) => (
              <QuestionReview key={result.questionId} result={result} index={i} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}