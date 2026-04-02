// components/MarkdownRenderer.jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Open links in new tab safely
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer" />
        ),
        // Style code blocks
        code: ({ node, inline, className, children, ...props }) => {
          return inline ? (
            <code
              className="bg-gray-100 text-red-500 px-1 py-0.5 rounded text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          ) : (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-2">
              <code className="text-sm font-mono" {...props}>
                {children}
              </code>
            </pre>
          );
        },
        // Style other elements
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => (
          <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>
        ),
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-bold mb-1">{children}</h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2 text-gray-600">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-2">
            <table className="min-w-full border border-gray-300 text-sm">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-gray-300 px-3 py-1 bg-gray-100 font-semibold text-left">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-300 px-3 py-1">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default MarkdownRenderer;
