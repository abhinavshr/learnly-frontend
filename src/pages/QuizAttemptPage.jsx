import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { X, Clock, ChevronRight, ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { startAttempt, submitAttempt, resetAttempt } from "../features/attempt/attemptSlice.js";

const LETTERS = ["A", "B", "C", "D"];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function QuizAttemptPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "exam" ? "exam" : "practice";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    attemptId,
    questions,
    totalQuestions,
    timeLimitSeconds,
    startStatus,
    startError,
    submitStatus,
    submitError,
  } = useSelector((state) => state.attempt);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: optionIndex }
  const [timeLeft, setTimeLeft] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const hasSubmittedRef = useRef(false);

  // Start the attempt once on mount, clean up Redux state on leave
  useEffect(() => {
    dispatch(startAttempt({ quizId: id, mode, timeLimitMinutes: undefined }));
    return () => dispatch(resetAttempt());
  }, [dispatch, id, mode]);

  // Seed the countdown once the real time limit arrives from the backend
  useEffect(() => {
    if (timeLimitSeconds != null) setTimeLeft(timeLimitSeconds);
  }, [timeLimitSeconds]);

  const total = totalQuestions || questions.length;
  const question = questions[index];
  const isLast = index === total - 1;
  const isSubmitting = submitStatus === "loading";

  const buildAnswersPayload = useCallback(
    () =>
      questions.map((q) => ({
        questionId: q.id,
        selectedIndex: answers[q.id] ?? null,
      })),
    [questions, answers]
  );

  const handleSubmit = useCallback(() => {
    if (hasSubmittedRef.current || !attemptId) return;
    hasSubmittedRef.current = true;
    dispatch(submitAttempt({ attemptId, answers: buildAnswersPayload() })).then((result) => {
      if (submitAttempt.fulfilled.match(result)) {
        navigate(`/attempts/${attemptId}`);
      } else {
        hasSubmittedRef.current = false; // allow retry on failure
      }
    });
  }, [attemptId, dispatch, buildAnswersPayload, navigate]);

  // Exam timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, handleSubmit]);

  function selectOption(optionIndex) {
    setAnswers((a) => ({ ...a, [question.id]: optionIndex }));
  }

  function goNext() {
    if (isLast) {
      handleSubmit();
    } else {
      setIndex((i) => i + 1);
    }
  }

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  if (startStatus === "loading" || startStatus === "idle") {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-6 h-6 text-ink-soft animate-spin mx-auto mb-3" />
          <p className="text-sm text-ink-soft">Setting up your quiz...</p>
        </div>
      </div>
    );
  }

  if (startStatus === "failed") {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <AlertCircle className="w-6 h-6 text-error mx-auto mb-3" />
          <p className="text-sm text-error mb-6">{startError}</p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-rule px-4 py-2 text-sm font-medium text-ink hover:bg-white transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null; // guards the brief gap between succeeded status and first render

  const answeredCount = Object.keys(answers).length;
  const isLowTime = timeLeft !== null && timeLeft <= 30;

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="border-b border-rule bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="text-ink-soft hover:text-ink transition-colors"
            aria-label="Exit quiz"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <div className="h-1.5 rounded-full bg-rule overflow-hidden">
              <div
                className="h-full bg-marigold transition-all duration-300"
                style={{ width: `${((index + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          <span className="text-sm text-ink-soft whitespace-nowrap">
            {index + 1} / {total}
          </span>

          {timeLeft !== null && (
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap
                ${isLowTime ? "text-error" : "text-ink-soft"}`}
            >
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <p className="text-sm font-medium text-marigold mb-3">{question.topic}</p>

          <h1 className="font-serif text-2xl sm:text-3xl text-ink leading-snug mb-8">
            {question.question}
          </h1>

          {submitError && (
            <div className="flex items-center gap-2 text-sm text-error bg-error/10 border border-error/30 rounded-lg px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {submitError}
            </div>
          )}

          <div className="space-y-3">
            {question.options.map((option, i) => {
              const isSelected = answers[question.id] === i;
              return (
                <button
                  key={i}
                  onClick={() => selectOption(i)}
                  disabled={isSubmitting}
                  className={`w-full flex items-center gap-4 text-left rounded-xl border px-5 py-4
                    transition-colors focus:outline-none focus:ring-4 focus:ring-marigold/20
                    disabled:opacity-60
                    ${isSelected ? "border-marigold bg-marigold/10" : "border-rule bg-white hover:border-ink/30"}`}
                >
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium
                      ${isSelected ? "bg-marigold text-white" : "bg-paper text-ink-soft"}`}
                  >
                    {LETTERS[i]}
                  </span>
                  <span className="text-ink">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-10">
            <button
              onClick={goPrev}
              disabled={index === 0 || isSubmitting}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft
                hover:text-ink transition-colors disabled:opacity-0 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={goNext}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-ink text-white font-medium
                px-5 py-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all
                focus:outline-none focus:ring-4 focus:ring-marigold/30
                disabled:opacity-60 disabled:pointer-events-none"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLast
                ? isSubmitting
                  ? "Submitting..."
                  : `Submit (${answeredCount}/${total} answered)`
                : "Next"}
              {!isSubmitting && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </main>

      {showExitConfirm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-6 z-20">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h2 className="font-serif text-xl font-semibold text-ink mb-2">Leave this quiz?</h2>
            <p className="text-ink-soft text-sm mb-6">
              Your progress on this attempt won't be saved if you leave now.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 rounded-lg border border-rule py-2.5 text-sm font-medium text-ink
                  hover:bg-paper transition-colors"
              >
                Keep going
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-1 rounded-lg bg-error text-white py-2.5 text-sm font-medium
                  hover:bg-error/90 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}