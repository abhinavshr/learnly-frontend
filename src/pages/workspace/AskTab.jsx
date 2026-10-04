import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Send, FileText, Loader2, AlertCircle } from "lucide-react";
import { askQuestion } from "../../features/qa/qaSlice.js";

export default function AskTab({ documentId }) {
  const dispatch = useDispatch();
  const thread = useSelector((state) => state.qa.byDocument[documentId]);
  const messages = thread?.messages ?? [];
  const isLoading = thread?.status === "loading";
  const error = thread?.error;

  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Keep the latest message in view as the conversation grows
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  function handleSubmit(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    dispatch(askQuestion({ documentId, question }));
    setInput("");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-220px)]">
      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex items-center justify-center text-center">
            <div className="max-w-xs">
              <p className="text-ink font-medium mb-1">Ask anything about this document</p>
              <p className="text-sm text-ink-soft">
                Answers are grounded in the pages you uploaded, with citations.
              </p>
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="bg-ink text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-lg text-sm">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start">
              <div className="max-w-xl">
                <div className="bg-white border border-rule rounded-2xl rounded-tl-sm px-4 py-3 text-ink text-sm leading-relaxed whitespace-pre-wrap">
                  {m.text}
                </div>
                {m.sources?.length > 0 && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {m.sources.map((s, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center gap-1 text-xs text-ink-soft bg-white border border-rule rounded-full px-2 py-0.5"
                      >
                        <FileText className="w-3 h-3" />
                        Page {s.pageNumber}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-rule rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-ink-soft animate-spin" />
              <span className="text-sm text-ink-soft">Thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-error bg-error/10 border border-error/30 rounded-lg px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4 border-t border-rule mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this document"
          disabled={isLoading}
          className="flex-1 rounded-lg border border-rule bg-white px-4 py-2.5 text-sm text-ink
            placeholder:text-ink-soft/50 focus:outline-none focus:ring-4 focus:ring-marigold/20
            focus:border-marigold transition-shadow disabled:bg-paper"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="rounded-lg bg-ink text-white p-2.5 hover:bg-ink/90 active:scale-[0.97]
            transition-all focus:outline-none focus:ring-4 focus:ring-marigold/30
            disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Send"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}