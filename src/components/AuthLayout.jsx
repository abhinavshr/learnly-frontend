import { Sparkles, CheckCircle2 } from "lucide-react";

export default function AuthLayout({ eyebrow, headline, children }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left: dark hero with a floating product moment */}
      <div className="hidden md:flex flex-col justify-between p-12 lg:p-16 bg-ink relative overflow-hidden">
        {/* faint ruled texture, kept subtle so it doesn't compete with the card */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent, transparent 27px, #fff 28px)",
          }}
        />

        <span className="font-serif text-2xl font-semibold text-white relative">
          Learnly
        </span>

        <div className="relative">
          <p className="font-serif text-4xl leading-[1.15] text-white max-w-md mb-10">
            {headline}
          </p>

          {/* Floating mock card: a flashcard mid-review */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 p-6 max-w-sm rotate-[-1.5deg]">
            <div className="flex items-center gap-1.5 text-xs font-medium text-ink-soft mb-4">
              <Sparkles className="w-3.5 h-3.5 text-marigold" />
              From "Chapter 4 — Cell Biology", page 12
            </div>
            <p className="font-serif text-lg text-ink leading-snug mb-5">
              What organelle is responsible for producing ATP?
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-marigold bg-marigold/10 px-3 py-2">
                <span className="text-sm text-ink font-medium">Mitochondria</span>
                <CheckCircle2 className="w-4 h-4 text-marigold" />
              </div>
              <div className="rounded-lg border border-rule px-3 py-2">
                <span className="text-sm text-ink-soft">Ribosome</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/50 max-w-xs relative">
          Every question, summary and flashcard is generated from the pages
          you upload — nothing else.
        </p>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-8 sm:p-12 md:p-16 bg-paper">
        <div className="w-full max-w-sm">
          {eyebrow && <p className="text-sm text-ink-soft mb-2">{eyebrow}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}