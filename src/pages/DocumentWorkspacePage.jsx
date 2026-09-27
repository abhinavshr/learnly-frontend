import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Sparkles, FileText, Target, Layers } from "lucide-react";
import AskTab from "./workspace/AskTab.jsx";
import ExplainTab from "./workspace/ExplainTab.jsx";
import SummaryTab from "./workspace/SummaryTab.jsx";
import QuizTab from "./workspace/QuizTab.jsx";
import FlashcardsTab from "./workspace/FlashcardsTab.jsx";

const TABS = [
  { id: "ask", label: "Ask", icon: MessageCircle },
  { id: "explain", label: "Explain", icon: Sparkles },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "quiz", label: "Quiz", icon: Target },
  { id: "flashcards", label: "Flashcards", icon: Layers },
];

export default function DocumentWorkspacePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("ask");

  // Static placeholder — real title will come from the API using `id`
  const documentTitle = "Ticketing Documentation";

  return (
    <div className="min-h-screen bg-paper">
      {/* Topbar */}
      <header className="border-b border-rule bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-serif text-xl font-semibold text-ink">Learnly</span>
          <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center text-sm font-medium">
            A
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to documents
        </Link>

        <h1 className="font-serif text-3xl font-semibold text-ink mb-6">{documentTitle}</h1>

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-rule mb-8 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px
                  whitespace-nowrap transition-colors
                  ${isActive
                    ? "border-marigold text-ink"
                    : "border-transparent text-ink-soft hover:text-ink"}`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === "ask" && <AskTab />}
        {activeTab === "explain" && <ExplainTab />}
        {activeTab === "summary" && <SummaryTab />}
        {activeTab === "quiz" && <QuizTab />}
        {activeTab === "flashcards" && <FlashcardsTab />}
      </main>
    </div>
  );
}