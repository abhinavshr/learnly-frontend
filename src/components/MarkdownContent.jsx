import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Strips stray/unmatched ``` fences so one bad fence can't swallow the rest
// of the response into a single unparsed code block.
function sanitizeMarkdown(content) {
  if (!content) return content;
  const fenceCount = (content.match(/```/g) || []).length;
  return fenceCount % 2 !== 0 ? content.replace(/```/g, "") : content;
}

const components = {
  h2: ({ children }) => (
    <h2 className="font-serif text-2xl font-semibold text-ink mt-6 mb-3 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-serif text-xl font-semibold text-ink mt-5 mb-2">{children}</h3>
  ),
  p: ({ children }) => <p className="text-ink leading-relaxed mb-4 break-words">{children}</p>,
  ul: ({ children }) => <ul className="list-disc list-inside text-ink leading-relaxed space-y-1.5 mb-4">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside text-ink leading-relaxed space-y-1.5 mb-4">{children}</ol>,
  li: ({ children }) => <li className="break-words">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  code: ({ children }) => (
    <code className="bg-paper text-ink rounded px-1.5 py-0.5 text-[0.85em] break-words">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="bg-paper border border-rule rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap break-words mb-4">
      {children}
    </pre>
  ),
};

export default function MarkdownContent({ content }) {
  return (
    <div className="overflow-hidden">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {sanitizeMarkdown(content)}
      </ReactMarkdown>
    </div>
  );
}