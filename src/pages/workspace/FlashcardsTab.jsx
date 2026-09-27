import { useState } from "react";
import { RotateCw, X, Meh, Check, Zap } from "lucide-react";

const MOCK_CARDS = [
  { front: "Who purchases tickets in a Box Tournament?", back: "The team captain, who also provides the team name and each member's details." },
  { front: "What are the four tournament types?", back: "Pro Clubs (11v11), Box Tournament, 1v1 Tournament, and LAN Tournament." },
  { front: "What data verifies a LAN Tournament attendee's age?", back: "Date of Birth, which is required specifically for age verification at the physical venue." },
];

const RATINGS = [
  { id: 0, label: "Forgot", icon: X, className: "hover:bg-error/10 hover:text-error hover:border-error" },
  { id: 1, label: "Hard", icon: Meh, className: "hover:bg-marigold/10 hover:text-marigold hover:border-marigold" },
  { id: 2, label: "Good", icon: Check, className: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-600" },
  { id: 3, label: "Easy", icon: Zap, className: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-600" },
];

export default function FlashcardsTab() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = MOCK_CARDS[index];

  function handleRate() {
    setFlipped(false);
    setIndex((i) => (i + 1) % MOCK_CARDS.length);
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-ink-soft">
          Card {index + 1} of {MOCK_CARDS.length} due today
        </p>
        <p className="text-sm text-ink-soft">Ticketing Documentation</p>
      </div>

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
          {flipped ? "Showing answer" : "Tap to reveal answer"}
        </div>
      </button>

      {flipped && (
        <div className="grid grid-cols-4 gap-2 mt-5">
          {RATINGS.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={handleRate}
                className={`flex flex-col items-center gap-1 rounded-lg border border-rule py-3
                  text-ink-soft transition-colors ${r.className}`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span className="text-xs font-medium">{r.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}