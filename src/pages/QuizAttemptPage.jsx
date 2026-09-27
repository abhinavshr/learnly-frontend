import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Clock, ChevronRight, ChevronLeft } from "lucide-react";

// Static mock data — matches the shape /api/quizzes/:id/attempts returns
const MODE = "exam"; // toggle to "practice" to see the untimed variant
const TIME_LIMIT_SECONDS = MODE === "exam" ? 5 * 60 : null;

const QUESTIONS = [
  {
    id: 1,
    question: "Who is responsible for purchasing tickets in a Box Tournament?",
    options: ["Each team member individually", "The event organizer", "The Super Admin", "The team captain"],
    topic: "Tournament formats",
  },
  {
    id: 2,
    question: "Which payment gateway is a global gateway rather than Nepal-specific?",
    options: ["eSewa", "Khalti", "Stripe", "FonePay"],
    topic: "Payments",
  },
  {
    id: 3,
    question: "Which of these is NOT a valid order status in the system?",
    options: ["Pending", "Paid", "Shipped", "Refunded"],
    topic: "Order statuses",
  },
  {
    id: 4,
    question: "How many position preferences must a Pro Clubs player provide?",
    options: ["1", "2", "3", "5"],
    topic: "Tournament formats",
  },
  {
    id: 5,
    question: "What is encrypted to generate an attendee's check-in QR code?",
    options: ["Email + password", "user_id + event_id + ticket_id", "Order number + amount", "Gamertag + platform"],
    topic: "Check-in",
  },
];

const LETTERS = ["A", "B", "C", "D"];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function QuizAttemptPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: optionIndex }
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const question = QUESTIONS[index];
  const total = QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const isLast = index === total - 1;

  const handleSubmit = useCallback(() => {
    // No backend call yet. In practice this posts `answers` to
    // /api/attempts/:id/submit and navigates to /attempts/:id
    navigate(`/attempts/${id}`);
  }, [id, navigate]);

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

  const isLowTime = timeLeft !== null && timeLeft <= 30;

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Minimal top bar: exit + progress + timer */}
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

      {/* Question */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <p className="text-sm font-medium text-marigold mb-3">{question.topic}</p>

          <h1 className="font-serif text-2xl sm:text-3xl text-ink leading-snug mb-8">
            {question.question}
          </h1>

          <div className="space-y-3">
            {question.options.map((option, i) => {
              const isSelected = answers[question.id] === i;
              return (
                <button
                  key={i}
                  onClick={() => selectOption(i)}
                  className={`w-full flex items-center gap-4 text-left rounded-xl border px-5 py-4
                    transition-colors focus:outline-none focus:ring-4 focus:ring-marigold/20
                    ${isSelected
                      ? "border-marigold bg-marigold/10"
                      : "border-rule bg-white hover:border-ink/30"}`}
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

          {/* Nav */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={goPrev}
              disabled={index === 0}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft
                hover:text-ink transition-colors disabled:opacity-0 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={goNext}
              className="inline-flex items-center gap-1.5 rounded-lg bg-ink text-white font-medium
                px-5 py-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all
                focus:outline-none focus:ring-4 focus:ring-marigold/30"
            >
              {isLast ? `Submit (${answeredCount}/${total} answered)` : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Exit confirmation */}
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