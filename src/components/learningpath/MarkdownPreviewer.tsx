import Markdown from "markdown-to-jsx";
import { useEffect, useRef, useState } from "react";

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
  markdownUrl,
}: {
  markdownUrl: string | null;
}) {
  const [markdown, setMarkdown] = useState(errorMessage);

  useEffect(() => {
    // TODO: This has to be changed later... AND IS NOT OPTIMAL!!!
    const modules = import.meta.glob("/public/static/learningpath/*.md");
    /*   for (const path in modules) {
      console.log(path);
      modules[path]().then((mod) => setMarkdown(mod.default));
    } */

    const relativePath = markdownUrl?.startsWith("/")
      ? markdownUrl.slice(1)
      : markdownUrl;
    const absolutePath = "/public/static/learningpath/" + relativePath;

    if (modules[absolutePath])
      modules[absolutePath]().then((mod: any) => setMarkdown(mod.default));
    else setMarkdown(errorMessage);
  }, [markdownUrl]);

  return (
    <div className="h-full w-full overflow-scroll border-2 border-secondary border-opacity-20 rounded-2xl p-4">
      <Markdown
        options={{
          overrides: { code: SyntaxHighlightedCode },
          disableParsingRawHTML: true,
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
