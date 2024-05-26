import Markdown from "markdown-to-jsx";
import { useEffect, useRef } from "react";

//
// NEW COMPONENT
//

import hljs from "highlight.js";
// import "highlight.js/styles/atom-one-dark.css";

function SyntaxHighlightedCode({ ...props }) {
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
}

const errorMessage = "Sorry, we could not load this.";

export default function LearnPathMarkdownPreviewer({
  markdown,
}: {
  markdown: string | null;
}) {
  return (
    <div className="h-full w-full overflow-scroll border-2 border-secondary border-opacity-20 rounded-2xl p-4">
      <Markdown
        options={{
          overrides: { code: SyntaxHighlightedCode },
          // disableParsingRawHTML: true,
        }}
      >
        {markdown || errorMessage}
      </Markdown>
    </div>
  );
}
