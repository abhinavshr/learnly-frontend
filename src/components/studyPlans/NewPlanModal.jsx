import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { X, Loader2 } from "lucide-react";
import { fetchDocuments } from "../../features/documents/documentsSlice.js";
import { generatePlan, resetGenerateStatus } from "../../features/studyPlans/studyPlansSlice.js";

export default function NewPlanModal({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: documents } = useSelector((state) => state.documents);
  const { generateStatus, generateError } = useSelector((state) => state.studyPlans);
  const isGenerating = generateStatus === "loading";

  const readyDocs = documents.filter((d) => d.status === "READY");

  const [title, setTitle] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(1.5);
  const [selectedIds, setSelectedIds] = useState([]); // empty = all ready documents

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  function toggleDoc(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!examDate || !hoursPerDay) return;

    const result = await dispatch(
      generatePlan({
        title: title.trim() || undefined,
        examDate,
        hoursPerDay: Number(hoursPerDay),
        documentIds: selectedIds.length > 0 ? selectedIds : undefined,
      })
    );

    if (generatePlan.fulfilled.match(result)) {
      dispatch(resetGenerateStatus());
      navigate(`/study-plans/${result.payload.plan.id}`);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-6 z-40">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-semibold text-ink">New study plan</h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {generateError && (
          <div className="rounded-lg bg-error/10 border border-error/30 text-error text-sm px-4 py-3 mb-4">
            {generateError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="block text-sm font-medium text-ink mb-1.5">Title (optional)</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Defaults to your document titles"
              disabled={isGenerating}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2.5 text-ink
                placeholder:text-ink-soft/50 focus:outline-none focus:ring-4 focus:ring-marigold/20
                focus:border-marigold transition-shadow disabled:bg-paper"
            />
          </label>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <label>
              <span className="block text-sm font-medium text-ink mb-1.5">Exam date</span>
              <input
                type="date"
                value={examDate}
                min={today}
                onChange={(e) => setExamDate(e.target.value)}
                required
                disabled={isGenerating}
                className="w-full rounded-lg border border-rule bg-white px-3 py-2.5 text-ink
                  focus:outline-none focus:ring-4 focus:ring-marigold/20 focus:border-marigold disabled:bg-paper"
              />
            </label>
            <label>
              <span className="block text-sm font-medium text-ink mb-1.5">Hours / day</span>
              <input
                type="number"
                min={0.5}
                max={12}
                step={0.5}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                required
                disabled={isGenerating}
                className="w-full rounded-lg border border-rule bg-white px-3 py-2.5 text-ink
                  focus:outline-none focus:ring-4 focus:ring-marigold/20 focus:border-marigold disabled:bg-paper"
              />
            </label>
          </div>

          <div className="mb-6">
            <span className="block text-sm font-medium text-ink mb-1.5">
              Documents {selectedIds.length === 0 && <span className="text-ink-soft font-normal">(all ready documents)</span>}
            </span>
            <div className="border border-rule rounded-lg divide-y divide-rule max-h-40 overflow-y-auto">
              {readyDocs.length === 0 && (
                <p className="text-sm text-ink-soft px-3 py-3">No ready documents yet.</p>
              )}
              {readyDocs.map((doc) => (
                <label key={doc.id} className="flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(doc.id)}
                    onChange={() => toggleDoc(doc.id)}
                    disabled={isGenerating}
                    className="w-4 h-4 rounded border-rule accent-[#E8A33D]"
                  />
                  <span className="text-ink truncate">{doc.title}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating || readyDocs.length === 0}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-white
              font-medium py-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all
              disabled:opacity-50 disabled:pointer-events-none"
          >
            {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
            {isGenerating ? "Building your plan..." : "Generate plan"}
          </button>
        </form>
      </div>
    </div>
  );
}