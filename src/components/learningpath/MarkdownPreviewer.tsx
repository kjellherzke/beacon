import Markdown from "markdown-to-jsx";
// import { useEffect, useRef } from "react";

//
// NEW COMPONENT
//

// import hljs from "highlight.js";
// import "highlight.js/styles/atom-one-dark.css";

/* function SyntaxHighlightedCode({ ...props }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current && props.className?.includes("lang-")) {
      hljs.highlightElement(ref.current);
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className]);

  return (
    <code ref={ref} className={props.className}>
      {props.children}
    </code>
  );
} */

const errorMessage = "Sorry, we could not load this.";

export default function LearnPathMarkdownPreviewer({
  markdown,
  isOpen,
  setOpen,
}: {
  markdown: string | null;
  isOpen: boolean;
  setOpen: (bool: boolean) => void;
}) {
  return (
    isOpen && (
      <div>
        <div
          onClick={() => setOpen(false)}
          className="absolute right-0 top-0 bottom-0 left-0 z-10 bg-black rounded-2xl bg-opacity-80 transition-all"
        />
        <div className="absolute right-0 top-0 bottom-0 z-20 w-full md:w-1/2 overflow-scroll border border-slate bg-background rounded-2xl p-4 pr-12">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-5 right-3 bg-slate p-1 rounded-2xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </button>
          <Markdown
            options={
              {
                // overrides: { code: SyntaxHighlightedCode },
                // disableParsingRawHTML: true,
              }
            }
          >
            {markdown || errorMessage}
          </Markdown>
        </div>
      </div>
    )
  );
}
