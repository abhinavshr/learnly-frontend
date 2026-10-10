import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Target, ChevronRight, Loader2, AlertCircle, Sparkles } from "lucide-react";
import {
  fetchQuizzesForDocument,
  generateQuiz,
  generateWeakTopicQuiz,
} from "../../features/quiz/quizSlice.js";

const DIFFICULTIES = ["easy", "medium", "hard"];

function formatDate(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function QuizTab({ documentId }) {
  const dispatch = useDispatch();
  const entry = useSelector((state) => state.quiz.byDocument[documentId]);

  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");

  const quizzes = entry?.quizzes ?? [];
  const listStatus = entry?.listStatus ?? "idle";
  const listError = entry?.listError;
  const isGenerating = entry?.generateStatus === "loading";
  const generateError = entry?.generateError;

  useEffect(() => {
    dispatch(fetchQuizzesForDocument(documentId));
  }, [dispatch, documentId]);

  async function handleGenerate() {
    const result = await dispatch(generateQuiz({ documentId, count: Number(count), difficulty }));
    if (generateQuiz.fulfilled.match(result)) {
      dispatch(fetchQuizzesForDocument(documentId)); // pick up the real questionCount
    }
  }

  async function handleGenerateWeak() {
    const result = await dispatch(generateWeakTopicQuiz({ documentId, count: Number(count), difficulty }));
    if (generateWeakTopicQuiz.fulfilled.match(result)) {
      dispatch(fetchQuizzesForDocument(documentId));
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white border border-rule rounded-xl p-6 mb-8">
        <h2 className="font-serif text-xl font-semibold text-ink mb-4">Generate a new quiz</h2>

        {generateError && (
          <div className="flex items-center gap-2 text-sm text-error bg-error/10 border border-error/30 rounded-lg px-4 py-3 mb-5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {generateError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-5">
          <label className="flex-1">
            <span className="block text-sm font-medium text-ink mb-1.5">Number of questions</span>
            <input
              type="number"
              min={3}
              max={15}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              disabled={isGenerating}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2 text-ink
                focus:outline-none focus:ring-4 focus:ring-marigold/20 focus:border-marigold disabled:bg-paper"
            />
          </label>

          <div className="flex-1">
            <span className="block text-sm font-medium text-ink mb-1.5">Difficulty</span>
            <div className="flex rounded-lg border border-rule bg-white p-1">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  disabled={isGenerating}
                  className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors
                    ${difficulty === d ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-white font-medium
              px-5 py-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all
              focus:outline-none focus:ring-4 focus:ring-marigold/30
              disabled:opacity-50 disabled:pointer-events-none"
          >
            {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
            {isGenerating ? "Generating..." : "Generate quiz"}
          </button>

          <button
            onClick={handleGenerateWeak}
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-rule text-ink font-medium
              px-5 py-2.5 hover:bg-paper transition-colors
              disabled:opacity-50 disabled:pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-marigold" />
            Quiz my weak topics
          </button>
        </div>
      </div>

      <h3 className="font-medium text-ink mb-3">Past quizzes</h3>

      {listStatus === "loading" && (
        <div className="rounded-xl border border-rule bg-white py-10 text-center">
          <Loader2 className="w-5 h-5 text-ink-soft animate-spin mx-auto" />
        </div>
      )}

      {listStatus === "failed" && (
        <div className="flex items-center gap-2 text-sm text-error bg-error/10 border border-error/30 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {listError}
        </div>
      )}

      {listStatus === "succeeded" && quizzes.length === 0 && (
        <div className="rounded-xl border border-dashed border-rule bg-white py-10 text-center">
          <Target className="w-6 h-6 text-ink-soft mx-auto mb-2" />
          <p className="text-sm text-ink-soft">No quizzes yet — generate one above.</p>
        </div>
      )}

      {listStatus === "succeeded" && quizzes.length > 0 && (
        <div className="rounded-xl border border-rule bg-white overflow-hidden">
          {quizzes.map((q) => (
            <Link
              key={q.id}
              to={`/quizzes/${q.id}/attempt`}
              className="flex items-center gap-4 px-5 py-4 border-b border-rule last:border-b-0
                hover:bg-paper cursor-pointer transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-marigold/10 flex items-center justify-center shrink-0">
                <Target className="w-4.5 h-4.5 text-marigold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink truncate">{q.title}</p>
                <p className="text-sm text-ink-soft capitalize">
                  {q.questionCount != null ? `${q.questionCount} questions · ` : ""}
                  {q.difficulty} · {formatDate(q.createdAt)}
                </p>
              </div>
              <ChevronRight className="w-4.5 h-4.5 text-ink-soft" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}