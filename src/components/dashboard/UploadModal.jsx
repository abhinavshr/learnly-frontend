import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload, X, Loader2, FileText } from "lucide-react";
import { uploadDocument, resetUploadStatus } from "../../features/documents/documentsSlice.js";

export default function UploadModal({ onClose }) {
  const dispatch = useDispatch();
  const { uploadStatus, uploadError } = useSelector((state) => state.documents);
  const isUploading = uploadStatus === "loading";

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const fileInputRef = useRef(null);

  // Close automatically once the upload succeeds
  useEffect(() => {
    if (uploadStatus === "succeeded") {
      dispatch(resetUploadStatus());
      onClose();
    }
  }, [uploadStatus, dispatch, onClose]);

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    dispatch(uploadDocument({ file, title: title.trim() || undefined }));
  }

  function handleClose() {
    dispatch(resetUploadStatus());
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-6 z-40">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-xl font-semibold text-ink">Upload a PDF</h2>
          <button onClick={handleClose} className="text-ink-soft hover:text-ink transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {uploadError && (
          <div className="rounded-lg bg-error/10 border border-error/30 text-error text-sm px-4 py-3 mb-4">
            {uploadError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex flex-col items-center justify-center gap-2 rounded-lg
              border-2 border-dashed border-rule hover:border-marigold/50 transition-colors
              py-8 mb-4 disabled:opacity-60"
          >
            {file ? (
              <>
                <FileText className="w-6 h-6 text-marigold" />
                <span className="text-sm text-ink font-medium truncate max-w-[90%]">{file.name}</span>
                <span className="text-xs text-ink-soft">{(file.size / 1024 / 1024).toFixed(1)} MB — click to change</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-ink-soft" />
                <span className="text-sm text-ink-soft">Click to choose a PDF (max 20 MB)</span>
              </>
            )}
          </button>

          <label className="block mb-5">
            <span className="block text-sm font-medium text-ink mb-1.5">Title (optional)</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Defaults to the file name"
              disabled={isUploading}
              className="w-full rounded-lg border border-rule bg-white px-3 py-2.5 text-ink
                placeholder:text-ink-soft/50 focus:outline-none focus:ring-4 focus:ring-marigold/20
                focus:border-marigold transition-shadow disabled:bg-paper"
            />
          </label>

          <button
            type="submit"
            disabled={!file || isUploading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-white
              font-medium py-2.5 hover:bg-ink/90 active:scale-[0.99] transition-all
              disabled:opacity-50 disabled:pointer-events-none"
          >
            {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}