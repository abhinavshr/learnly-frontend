import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RotateCw, Loader2, AlertCircle, Layers, Trash2, Plus } from "lucide-react";
import {
  fetchFlashcardsForDocument,
  generateFlashcards,
  deleteFlashcard,
} from "../../features/flashcards/flashcardsSlice.js";

export default function FlashcardsTab({ documentId }) {
  const dispatch = useDispatch();
  const entry = useSelector((state) => state.flashcards.byDocument[documentId]);

  const [count, setCount] = useState(10);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = entry?.cards ?? [];
  const listStatus = entry?.listStatus ?? "idle";
  const isGenerating = entry?.generateStatus === "loading";
  const generateError = entry?.generateError;

  useEffect(() => {
    dispatch(fetchFlashcardsForDocument(documentId));
  }, [dispatch, documentId]);

  // Keep the preview pointer in range as cards are generated/deleted
  useEffect(() => {
    if (previewIndex >= cards.length) setPreviewIndex(0);
  }, [cards.length, previewIndex]);

  function handleGenerate() {
    dispatch(generateFlashcards({ documentId, count: Number(count) }));
  }

  function handleDelete(id) {
    dispatch(deleteFlashcard({ id, documentId }));
    setFlipped(false);
  }

  const card = cards[previewIndex];

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white border border-rule rounded-xl p-6 mb-8">
        <h2 className="font-serif text-xl font-semibold text-ink mb-4">Generate flashcards</h2>

        {generateError && (
          <div className="flex items-center gap-2 text-sm text-error bg-error/10 border border-error/30 rounded-lg px-4 py-3 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {generateError}
          </div>
        )}

        <div className="flex gap-3">
          <input
            type="number"
            min={3}
            max={30}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            disabled={isGenerating}
            className="w-24 rounded-lg border border-rule bg-white px-3 py-2 text-ink
              focus:outline-none focus:ring-4 focus:ring-marigold/20 focus:border-marigold disabled:bg-paper"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-white font-medium
              px-5 py-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all
              disabled:opacity-50 disabled:pointer-events-none"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isGenerating ? "Generating..." : "Generate cards"}
          </button>
        </div>
      </div>

      {listStatus === "loading" && (
        <div className="rounded-xl border border-rule bg-white py-16 text-center">
          <Loader2 className="w-6 h-6 text-ink-soft animate-spin mx-auto" />
        </div>
      )}

      {listStatus === "succeeded" && cards.length === 0 && (
        <div className="rounded-xl border border-dashed border-rule bg-white py-16 text-center">
          <Layers className="w-6 h-6 text-ink-soft mx-auto mb-2" />
          <p className="text-sm text-ink-soft">No flashcards yet — generate some above.</p>
        </div>
      )}

      {listStatus === "succeeded" && cards.length > 0 && card && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-ink-soft">
              Card {previewIndex + 1} of {cards.length}
            </p>
            <button
              onClick={() => handleDelete(card.id)}
              className="inline-flex items-center gap-1.5 text-sm text-error hover:text-error/80 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete this card
            </button>
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

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => {
                setFlipped(false);
                setPreviewIndex((i) => (i - 1 + cards.length) % cards.length);
              }}
              className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
            >
              Previous
            </button>
            <Link
              to="/flashcards/review"
              className="inline-flex items-center gap-1.5 rounded-lg bg-marigold text-ink font-medium
                px-4 py-2 text-sm hover:bg-marigold/90 transition-colors"
            >
              Start full review session
            </Link>
            <button
              onClick={() => {
                setFlipped(false);
                setPreviewIndex((i) => (i + 1) % cards.length);
              }}
              className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}