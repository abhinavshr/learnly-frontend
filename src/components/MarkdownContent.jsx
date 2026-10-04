import ReactMarkdown from "react-markdown";

const components = {
  h2: ({ children }) => (
    <h2 className="font-serif text-2xl font-semibold text-ink mt-6 mb-3 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-serif text-xl font-semibold text-ink mt-5 mb-2">{children}</h3>
  ),
  p: ({ children }) => <p className="text-ink leading-relaxed mb-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc list-inside text-ink leading-relaxed space-y-1.5 mb-4">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside text-ink leading-relaxed space-y-1.5 mb-4">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
};

export default function MarkdownContent({ content }) {
  return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
}