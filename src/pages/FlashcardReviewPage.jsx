import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { X, RotateCw, Check, Meh, Zap, PartyPopper, Loader2, AlertCircle } from "lucide-react";
import { fetchDueFlashcards, reviewFlashcard } from "../features/flashcards/flashcardsSlice.js";

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
  const dispatch = useDispatch();
  const { cards, status, error } = useSelector((state) => state.flashcards.due);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tally, setTally] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });
  const [done, setDone] = useState(false);
  const [isRating, setIsRating] = useState(false);

  const total = cards.length;
  const card = cards[index];

  useEffect(() => {
    dispatch(fetchDueFlashcards());
  }, [dispatch]);

  const rate = useCallback(
    async (ratingId) => {
      if (!flipped || done || isRating || !card) return;
      setIsRating(true);

      const result = await dispatch(reviewFlashcard({ id: card.id, quality: ratingId }));
      setIsRating(false);

      if (reviewFlashcard.fulfilled.match(result)) {
        setTally((t) => ({ ...t, [ratingId]: t[ratingId] + 1 }));

        if (index + 1 >= total) {
          setDone(true);
        } else {
          setFlipped(false);
          setIndex((i) => i + 1);
        }
      }
      // on failure, stay on the same card so the student can retry
    },
    [flipped, done, isRating, card, index, total, dispatch]
  );

  useEffect(() => {
    function handleKey(e) {
      if (done || status !== "succeeded") return;
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
  }, [rate, done, status]);

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
          <Link to="/" className="rounded-lg border border-rule px-4 py-2 text-sm font-medium text-ink hover:bg-white transition-colors">
            Back to documents
          </Link>
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-marigold/10 flex items-center justify-center mx-auto mb-5">
            <PartyPopper className="w-6 h-6 text-marigold" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-ink mb-2">You're all caught up</h1>
          <p className="text-ink-soft mb-8">No flashcards are due for review right now.</p>
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

  if (!card) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-ink-soft animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col">
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
                  disabled={!flipped || isRating}
                  className={`flex flex-col items-center gap-1 rounded-lg border border-rule py-3
                    text-ink-soft transition-colors disabled:opacity-40 disabled:pointer-events-none
                    ${RATING_STYLES[r.color]}`}
                >
                  {isRating ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Icon className="w-4.5 h-4.5" />}
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