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
  return isOpen ? (
    <div>
      <div
        onClick={() => setOpen(false)}
        className="absolute right-0 top-0 bottom-0 left-0 bg-black rounded-2xl bg-opacity-80 transition-all"
      ></div>
      <div className="absolute right-0 top-0 bottom-0 overflow-scroll border-secondary bg-slate rounded-2xl p-4">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 border bg-slate border-primary p-1.5 rounded-2xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
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
  ) : (
    <button
      onClick={() => setOpen(true)}
      className="absolute right-3 top-3 border-2 bg-background border-slate p-2.5 rounded-2xl"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"
        />
      </svg>
    </button>
  );
}
