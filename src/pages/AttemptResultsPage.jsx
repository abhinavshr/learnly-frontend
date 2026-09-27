import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Check, X, ChevronDown, ArrowLeft, Clock, RotateCcw } from "lucide-react";

// Static mock — matches the shape POST /api/attempts/:id/submit returns
const ATTEMPT = {
  mode: "exam",
  score: 3,
  totalQuestions: 5,
  percentage: 60,
  timedOut: false,
};

const TOPICS = [
  { topic: "Payments", correct: 1, total: 2, accuracy: 50 },
  { topic: "Order statuses", correct: 1, total: 1, accuracy: 100 },
  { topic: "Tournament formats", correct: 1, total: 2, accuracy: 50 },
];

const RESULTS = [
  {
    questionId: 1,
    question: "Who is responsible for purchasing tickets in a Box Tournament?",
    options: ["Each team member individually", "The event organizer", "The Super Admin", "The team captain"],
    selectedIndex: 3,
    correctIndex: 3,
    isCorrect: true,
    explanation: "Box Tournaments use a team captain purchase: the captain buys for the whole team.",
    topic: "Tournament formats",
  },
  {
    questionId: 2,
    question: "Which payment gateway is a global gateway rather than Nepal-specific?",
    options: ["eSewa", "Khalti", "Stripe", "FonePay"],
    selectedIndex: 0,
    correctIndex: 2,
    isCorrect: false,
    explanation: "Stripe and PayPal are the global gateways. eSewa, Khalti and FonePay serve Nepal.",
    topic: "Payments",
  },
  {
    questionId: 3,
    question: "Which of these is NOT a valid order status in the system?",
    options: ["Pending", "Paid", "Shipped", "Refunded"],
    selectedIndex: 2,
    correctIndex: 2,
    isCorrect: true,
    explanation: "Valid statuses are Pending, Paid, Cancelled and Refunded. Tickets are digital, so there's no 'Shipped' state.",
    topic: "Order statuses",
  },
  {
    questionId: 4,
    question: "How many position preferences must a Pro Clubs player provide?",
    options: ["1", "2", "3", "5"],
    selectedIndex: 1,
    correctIndex: 2,
    isCorrect: false,
    explanation: "Pro Clubs tickets require three position preferences (position_pref_1, 2 and 3).",
    topic: "Tournament formats",
  },
  {
    questionId: 5,
    question: "What is encrypted to generate an attendee's check-in QR code?",
    options: ["Email + password", "user_id + event_id + ticket_id", "Order number + amount", "Gamertag + platform"],
    selectedIndex: 1,
    correctIndex: 1,
    isCorrect: true,
    explanation: "The QR code encodes user_id, event_id and ticket_id, encrypted and stored for check-in.",
    topic: "Check-in",
  },
];

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

  return (
    <div className="min-h-screen bg-paper">
      {/* Score hero */}
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
              {ATTEMPT.percentage}%
            </span>
            <div className="pb-2">
              <p className="text-white font-medium">
                {ATTEMPT.score} of {ATTEMPT.totalQuestions} correct
              </p>
              <p className="text-white/50 text-sm capitalize">{ATTEMPT.mode} mode</p>
            </div>
          </div>

          <p className="text-white/70 mt-4">{scoreMessage(ATTEMPT.percentage)}</p>

          {ATTEMPT.timedOut && (
            <div className="inline-flex items-center gap-1.5 text-sm text-marigold bg-marigold/10 rounded-full px-3 py-1 mt-4">
              <Clock className="w-3.5 h-3.5" />
              Submitted after time ran out
            </div>
          )}
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Topic breakdown */}
        <section className="mb-10">
          <h2 className="font-serif text-xl font-semibold text-ink mb-4">By topic</h2>
          <div className="bg-white border border-rule rounded-xl p-6 space-y-5">
            {TOPICS.map((t) => (
              <TopicBar key={t.topic} topic={t} />
            ))}
          </div>
        </section>

        {/* Action row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <button
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-white
              font-medium py-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all
              focus:outline-none focus:ring-4 focus:ring-marigold/30"
          >
            <RotateCcw className="w-4 h-4" />
            Quiz my weak topics
          </button>
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center rounded-lg border border-rule
              text-ink font-medium py-2.5 hover:bg-white transition-colors"
          >
            Back to document
          </Link>
        </div>

        {/* Per-question review */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-ink mb-4">Review</h2>
          <div className="space-y-3">
            {RESULTS.map((result, i) => (
              <QuestionReview key={result.questionId} result={result} index={i} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}