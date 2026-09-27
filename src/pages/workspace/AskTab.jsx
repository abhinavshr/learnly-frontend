import { useState } from "react";
import { Send, FileText } from "lucide-react";

const MOCK_MESSAGES = [
  {
    role: "user",
    text: "What are the possible order statuses?",
  },
  {
    role: "assistant",
    text: "The possible order statuses are Pending, Paid, Cancelled and Refunded.",
    sources: [{ page: 4 }, { page: 15 }],
  },
  {
    role: "user",
    text: "How does a Box Tournament ticket work?",
  },
  {
    role: "assistant",
    text: "A team captain buys the ticket for the whole team. They provide a team name, and each team member must individually confirm they're joining.",
    sources: [{ page: 4 }],
  },
];

export default function AskTab() {
  const [input, setInput] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // No backend call yet
    setInput("");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-220px)]">
      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        {MOCK_MESSAGES.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="bg-ink text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-lg text-sm">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start">
              <div className="max-w-xl">
                <div className="bg-white border border-rule rounded-2xl rounded-tl-sm px-4 py-3 text-ink text-sm leading-relaxed">
                  {m.text}
                </div>
                {m.sources && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {m.sources.map((s, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center gap-1 text-xs text-ink-soft bg-white border border-rule rounded-full px-2 py-0.5"
                      >
                        <FileText className="w-3 h-3" />
                        Page {s.page}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4 border-t border-rule mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this document"
          className="flex-1 rounded-lg border border-rule bg-white px-4 py-2.5 text-sm text-ink
            placeholder:text-ink-soft/50 focus:outline-none focus:ring-4 focus:ring-marigold/20
            focus:border-marigold transition-shadow"
        />
        <button
          type="submit"
          className="rounded-lg bg-ink text-white p-2.5 hover:bg-ink/90 active:scale-[0.97]
            transition-all focus:outline-none focus:ring-4 focus:ring-marigold/30"
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}