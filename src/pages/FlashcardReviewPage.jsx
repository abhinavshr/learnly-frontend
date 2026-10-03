import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { X, RotateCw, Check, Meh, Zap, PartyPopper } from "lucide-react";

// Static mock — matches the shape GET /api/flashcards/due returns
const DUE_CARDS = [
  {
    id: 1,
    front: "Who purchases tickets in a Box Tournament?",
    back: "The team captain, who also provides the team name and each member's details.",
    documentTitle: "Ticketing Documentation",
  },
  {
    id: 2,
    front: "What are the four tournament types?",
    back: "Pro Clubs (11v11), Box Tournament, 1v1 Tournament, and LAN Tournament.",
    documentTitle: "Ticketing Documentation",
  },
  {
    id: 3,
    front: "What organelle is responsible for producing ATP?",
    back: "Mitochondria — often called the powerhouse of the cell.",
    documentTitle: "Cell Biology — Chapter 4",
  },
  {
    id: 4,
    front: "What data verifies a LAN Tournament attendee's age?",
    back: "Date of Birth, required specifically for age verification at the physical venue.",
    documentTitle: "Ticketing Documentation",
  },
];

const RATINGS = [
  { id: 0, key: "1", label: "Forgot", icon: X, color: "error" },
  { id: 1, key: "2", label: "Hard", icon: Meh, color: "marigold" },
  { id: 2, key: "3", label: "Good", icon: Check, color: "emerald" },
  { id: 3, key: "4", label: "Easy", icon: Zap, color: "emerald" },
];

const RATING_STYLES = {
  error: "hover:bg-error/10 hover:text-error hover:border-error",
  marigold: "hover:bg-marigold/10 hover:text-marigold hover:border-marigold",
  emerald: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-600",
};

export default function FlashcardReviewPage() {
  const [queue, setQueue] = useState(DUE_CARDS);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tally, setTally] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });
  const [done, setDone] = useState(false);

  const total = DUE_CARDS.length;
  const card = queue[index];

  const rate = useCallback(
    (ratingId) => {
      if (!flipped || done) return;
      setTally((t) => ({ ...t, [ratingId]: t[ratingId] + 1 }));

      if (index + 1 >= total) {
        setDone(true);
      } else {
        setFlipped(false);
        setIndex((i) => i + 1);
      }
    },
    [flipped, done, index, total]
  );

  // Keyboard shortcuts: space/enter to flip, 1-4 to rate
  useEffect(() => {
    function handleKey(e) {
      if (done) return;
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
        return;
      }
      const rating = RATINGS.find((r) => r.key === e.key);
      if (rating) rate(rating.id);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [rate, done]);

  if (done) {
    const reviewedWell = tally[2] + tally[3];
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-marigold/10 flex items-center justify-center mx-auto mb-5">
            <PartyPopper className="w-6 h-6 text-marigold" />
          </div>
          <h1 className="font-serif text-3xl font-semibold text-ink mb-2">Session complete</h1>
          <p className="text-ink-soft mb-8">
            You reviewed {total} cards. {reviewedWell} of them you knew well.
          </p>

          <div className="grid grid-cols-4 gap-2 mb-8">
            {RATINGS.map((r) => (
              <div key={r.id} className="rounded-lg border border-rule bg-white py-3">
                <p className="font-serif text-xl font-semibold text-ink">{tally[r.id]}</p>
                <p className="text-xs text-ink-soft">{r.label}</p>
              </div>
            ))}
          </div>

          <Link
            to="/"
            className="inline-flex w-full items-center justify-center rounded-lg bg-ink text-white
              font-medium py-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all"
          >
            Back to documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Minimal top bar: exit + progress */}
      <header className="border-b border-rule bg-white sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/" className="text-ink-soft hover:text-ink transition-colors" aria-label="Exit review">
            <X className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <div className="h-1.5 rounded-full bg-rule overflow-hidden">
              <div
                className="h-full bg-marigold transition-all duration-300"
                style={{ width: `${(index / total) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-sm text-ink-soft whitespace-nowrap">
            {index + 1} / {total}
          </span>
        </div>
      </header>

      {/* Card */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <p className="text-sm text-ink-soft text-center mb-4">{card.documentTitle}</p>

          <button
            onClick={() => setFlipped((f) => !f)}
            className="w-full bg-white border border-rule rounded-2xl px-8 py-16 text-center
              hover:border-marigold/50 transition-colors focus:outline-none focus:ring-4 focus:ring-marigold/20"
          >
            <p className="font-serif text-2xl text-ink leading-snug">
              {flipped ? card.back : card.front}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-ink-soft mt-6">
              <RotateCw className="w-3.5 h-3.5" />
              {flipped ? "Showing answer" : "Space or tap to reveal"}
            </div>
          </button>

          <div className="grid grid-cols-4 gap-2 mt-5">
            {RATINGS.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  onClick={() => rate(r.id)}
                  disabled={!flipped}
                  className={`flex flex-col items-center gap-1 rounded-lg border border-rule py-3
                    text-ink-soft transition-colors disabled:opacity-40 disabled:pointer-events-none
                    ${RATING_STYLES[r.color]}`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span className="text-xs font-medium">{r.label}</span>
                  <span className="text-[10px] text-ink-soft/60">{r.key}</span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}