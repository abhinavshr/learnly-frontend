import { useState } from "react";
import { Sparkles } from "lucide-react";

const LEVELS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export default function ExplainTab() {
  const [topic, setTopic] = useState("How does a Box Tournament ticket work?");
  const [level, setLevel] = useState("beginner");

  return (
    <div className="max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What topic do you want explained?"
          className="flex-1 rounded-lg border border-rule bg-white px-4 py-2.5 text-sm text-ink
            placeholder:text-ink-soft/50 focus:outline-none focus:ring-4 focus:ring-marigold/20
            focus:border-marigold transition-shadow"
        />
        <div className="flex rounded-lg border border-rule bg-white p-1 shrink-0">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${level === l.id ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <article className="bg-white border border-rule rounded-xl p-8">
        <div className="flex items-center gap-1.5 text-xs font-medium text-ink-soft mb-6">
          <Sparkles className="w-3.5 h-3.5 text-marigold" />
          Explained for a {level} · pages 4, 29
        </div>

        <h2 className="font-serif text-2xl font-semibold text-ink mb-3">In one sentence</h2>
        <p className="text-ink leading-relaxed mb-6">
          A Box Tournament ticket lets a team captain buy for the whole team, name the
          team, and have every member confirm their spot individually.
        </p>

        <h2 className="font-serif text-2xl font-semibold text-ink mb-3">Analogy</h2>
        <p className="text-ink leading-relaxed mb-6">
          Think of it like booking an escape room for a group of friends. One person
          books the room and names the group, then everyone else replies "yes" to
          confirm they're coming.
        </p>

        <h2 className="font-serif text-2xl font-semibold text-ink mb-3">Quick check</h2>
        <ol className="list-decimal list-inside text-ink leading-relaxed space-y-1.5">
          <li>Who is responsible for purchasing the ticket in a Box Tournament?</li>
          <li>How many position preferences are required?</li>
        </ol>
      </article>
    </div>
  );
}